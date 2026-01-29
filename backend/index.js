const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// 配置CORS
app.use(cors());

// 配置存储
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = path.join(__dirname, 'storage');
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// 文件过滤器
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'video/mp4', 'video/webm', 'video/ogg'];
  const allowedExtensions = ['.ppt', '.pptx', '.mp4', '.webm', '.ogg'];
  
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('只允许上传PPT和视频文件'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  }
});

// 上传路由
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ code: 400, message: '请选择文件', data: {} });
  }
  
  res.json({
    code: 200,
    message: '上传成功',
    data: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  });
});

// 获取文件列表
app.get('/api/files', (req, res) => {
  const folder = path.join(__dirname, 'storage');
  
  if (!fs.existsSync(folder)) {
    return res.json({ code: 200, message: '获取成功', data: { files: [] } });
  }
  
  fs.readdir(folder, (err, files) => {
    if (err) {
      return res.status(500).json({ code: 500, message: '读取文件失败', data: {} });
    }
    
    const fileList = files.map(file => {
      const filePath = path.join(folder, file);
      const stats = fs.statSync(filePath);
      return {
        filename: file,
        size: stats.size,
        mtime: stats.mtime,
        url: `http://localhost:${PORT}/storage/${file}`
      };
    });
    
    res.json({ code: 200, message: '获取成功', data: { files: fileList } });
  });
});

// 静态文件服务
app.use('/storage', express.static(path.join(__dirname, 'storage')));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ code: 200, message: '服务运行正常', data: {} });
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
