# 邮数工坊 - 前后端统一接口说明文档

## 1. 项目概述

邮数工坊是一个专注于概率论与数理统计学科的教学辅助平台，通过大模型赋能，实现"教师端-学生端"双端场景的"教-学-练-用"全链路闭环。平台以学术严谨性与操作便捷性为核心，为教师和学生提供专业的概率统计教学解决方案。

## 2. 接口设计原则

- **RESTful设计风格**：使用HTTP方法表示操作类型，使用URL表示资源
- **统一响应格式**：所有接口返回统一的JSON格式，包含状态码、消息和数据
- **参数验证**：对所有请求参数进行严格验证，确保数据安全性
- **错误处理**：提供详细的错误信息，便于前端调试
- **版本控制**：通过URL路径进行版本控制，如`/api/v1/`

## 3. 基础结构

### 3.1 响应格式

```json
{
  "code": 200,        // 状态码，200表示成功，其他表示错误
  "message": "成功",  // 响应消息
  "data": {}          // 响应数据
}
```

### 3.2 错误码

| 错误码 | 描述 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未授权，需要登录 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 4. 接口列表

### 4.1 用户认证接口

#### 4.1.1 登录

- **URL**: `/api/v1/auth/login`
- **方法**: `POST`
- **参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | username | string | 是 | 用户名 |
  | password | string | 是 | 密码 |
  | identity | string | 是 | 身份类型，可选值：student, teacher |
  | studentId | string | 否 | 学号（学生身份时必填） |
  | teacherId | string | 否 | 工号（教师身份时必填） |

- **返回数据**:
  ```json
  {
    "code": 200,
    "message": "登录成功",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "username": "张三",
        "identity": "student",
        "studentId": "20230001",
        "avatar": "https://example.com/avatar.jpg"
      }
    }
  }
  ```

#### 4.1.2 注册

- **URL**: `/api/v1/auth/register`
- **方法**: `POST`
- **参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | username | string | 是 | 用户名 |
  | password | string | 是 | 密码 |
  | confirmPassword | string | 是 | 确认密码 |
  | identity | string | 是 | 身份类型，可选值：student, teacher |
  | studentId | string | 否 | 学号（学生身份时必填） |
  | teacherId | string | 否 | 工号（教师身份时必填） |

- **返回数据**:
  ```json
  {
    "code": 200,
    "message": "注册成功",
    "data": {
      "userId": 1
    }
  }
  ```

#### 4.1.3 登出

- **URL**: `/api/v1/auth/logout`
- **方法**: `POST`
- **参数**: 无（需要在请求头中携带token）
- **返回数据**:
  ```json
  {
    "code": 200,
    "message": "登出成功",
    "data": {}
  }
  ```

### 4.2 教师端接口

#### 4.2.1 实验管理

##### 4.2.1.1 创建实验

- **URL**: `/api/v1/teacher/experiments`
- **方法**: `POST`
- **参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | title | string | 是 | 实验标题 |
  | type | string | 是 | 实验类型，如：bernoulli, classical, conditional等 |
  | description | string | 是 | 实验描述 |
  | parameters | object | 是 | 实验参数 |
  | difficulty | string | 是 | 难度等级：easy, medium, hard |

- **返回数据**:
  ```json
  {
    "code": 200,
    "message": "创建成功",
    "data": {
      "experimentId": 1
    }
  }
  ```

##### 4.2.1.2 获取实验列表

- **URL**: `/api/v1/teacher/experiments`
- **方法**: `GET`
- **参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | page | number | 否 | 页码，默认1 |
  | pageSize | number | 否 | 每页数量，默认10 |
  | type | string | 否 | 实验类型 |

- **返回数据**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "total": 100,
      "experiments": [
        {
          "id": 1,
          "title": "伯努利实验",
          "type": "bernoulli",
          "description": "伯努利实验描述",
          "difficulty": "easy",
          "createdAt": "2026-01-30T12:00:00Z"
        }
      ]
    }
  }
  ```

##### 4.2.1.3 获取实验详情

- **URL**: `/api/v1/teacher/experiments/{id}`
- **方法**: `GET`
- **参数**: 无
- **返回数据**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "id": 1,
      "title": "伯努利实验",
      "type": "bernoulli",
      "description": "伯努利实验描述",
      "parameters": {
        "probability": 0.5,
        "trials": 1000
      },
      "difficulty": "easy",
      "createdAt": "2026-01-30T12:00:00Z"
    }
  }
  ```

##### 4.2.1.4 更新实验

- **URL**: `/api/v1/teacher/experiments/{id}`
- **方法**: `PUT`
- **参数**: 同创建实验
- **返回数据**:
  ```json
  {
    "code": 200,
    "message": "更新成功",
    "data": {}
  }
  ```

##### 4.2.1.5 删除实验

- **URL**: `/api/v1/teacher/experiments/{id}`
- **方法**: `DELETE`
- **参数**: 无
- **返回数据**:
  ```json
  {
    "code": 200,
    "message": "删除成功",
    "data": {}
  }
  ```

#### 4.2.2 学情分析

##### 4.2.2.1 获取班级学情报告

- **URL**: `/api/v1/teacher/reports/class`
- **方法**: `GET`
- **参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | classId | number | 是 | 班级ID |
  | startDate | string | 否 | 开始日期，格式：YYYY-MM-DD |
  | endDate | string | 否 | 结束日期，格式：YYYY-MM-DD |

- **返回数据**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "classId": 1,
      "className": "概率论与数理统计一班",
      "totalStudents": 40,
      "averageScore": 85.5,
      "completionRate": 95.0,
      "details": [
        {
          "studentId": "20230001",
          "studentName": "张三",
          "score": 90,
          "completionRate": 100,
          "weakPoints": ["条件概率", "贝叶斯定理"]
        }
      ]
    }
  }
  ```

##### 4.2.2.2 获取学生个人报告

- **URL**: `/api/v1/teacher/reports/student/{studentId}`
- **方法**: `GET`
- **参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | startDate | string | 否 | 开始日期，格式：YYYY-MM-DD |
  | endDate | string | 否 | 结束日期，格式：YYYY-MM-DD |

- **返回数据**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "studentId": "20230001",
      "studentName": "张三",
      "totalScore": 90,
      "averageScore": 88.5,
      "completionRate": 100,
      "experimentHistory": [
        {
          "experimentId": 1,
          "experimentName": "伯努利实验",
          "score": 95,
          "completedAt": "2026-01-30T12:00:00Z"
        }
      ],
      "weakPoints": ["条件概率", "贝叶斯定理"],
      "recommendations": ["建议加强条件概率的练习"]
    }
  }
  ```

#### 4.2.3 AI备课助手

- **URL**: `/api/v1/teacher/ai/lesson-plan`
- **方法**: `POST`
- **参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | topic | string | 是 | 备课主题 |
  | duration | number | 是 | 课时时长（分钟） |
  | difficulty | string | 是 | 难度等级：easy, medium, hard |
  | studentLevel | string | 是 | 学生水平：beginner, intermediate, advanced |

- **返回数据**:
  ```json
  {
    "code": 200,
    "message": "生成成功",
    "data": {
      "lessonPlan": {
        "title": "条件概率与贝叶斯定理",
        "duration": 90,
        "objectives": ["理解条件概率的定义", "掌握贝叶斯定理的应用"],
        "content": "课程内容...",
        "experiments": ["条件概率实验", "贝叶斯定理实验"],
        "exercises": ["练习题1", "练习题2"]
      }
    }
  }
  ```

### 4.3 学生端接口

#### 4.3.1 学习路径

- **URL**: `/api/v1/student/learning-path`
- **方法**: `GET`
- **参数**: 无
- **返回数据**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "path": [
        {
          "id": 1,
          "title": "概率论基础",
          "status": "completed",
          "progress": 100,
          "modules": [
            {
              "id": 1,
              "title": "随机事件与概率",
              "status": "completed",
              "progress": 100
            }
          ]
        },
        {
          "id": 2,
          "title": "条件概率与独立性",
          "status": "in_progress",
          "progress": 60,
          "modules": [
            {
              "id": 2,
              "title": "条件概率",
              "status": "completed",
              "progress": 100
            },
            {
              "id": 3,
              "title": "事件的独立性",
              "status": "in_progress",
              "progress": 20
            }
          ]
        }
      ]
    }
  }
  ```

#### 4.3.2 实验操作

##### 4.3.2.1 获取实验列表

- **URL**: `/api/v1/student/experiments`
- **方法**: `GET`
- **参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | page | number | 否 | 页码，默认1 |
  | pageSize | number | 否 | 每页数量，默认10 |
  | type | string | 否 | 实验类型 |
  | difficulty | string | 否 | 难度等级 |

- **返回数据**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "total": 50,
      "experiments": [
        {
          "id": 1,
          "title": "伯努利实验",
          "type": "bernoulli",
          "description": "伯努利实验描述",
          "difficulty": "easy",
          "status": "not_started"
        }
      ]
    }
  }
  ```

##### 4.3.2.2 获取实验详情

- **URL**: `/api/v1/student/experiments/{id}`
- **方法**: `GET`
- **参数**: 无
- **返回数据**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "id": 1,
      "title": "伯努利实验",
      "type": "bernoulli",
      "description": "伯努利实验描述",
      "parameters": {
        "probability": 0.5,
        "trials": 1000
      },
      "difficulty": "easy",
      "status": "not_started",
      "theory": "伯努利实验理论..."
    }
  }
  ```

##### 4.3.2.3 提交实验结果

- **URL**: `/api/v1/student/experiments/{id}/submit`
- **方法**: `POST`
- **参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | parameters | object | 是 | 实验参数 |
  | results | object | 是 | 实验结果 |
  | duration | number | 是 | 实验时长（秒） |

- **返回数据**:
  ```json
  {
    "code": 200,
    "message": "提交成功",
    "data": {
      "score": 95,
      "feedback": "实验结果符合预期，表现优秀",
      "correctAnswers": 10,
      "totalQuestions": 10
    }
  }
  ```

#### 4.3.3 习题练习

##### 4.3.3.1 获取练习题

- **URL**: `/api/v1/student/exercises`
- **方法**: `GET`
- **参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | type | string | 否 | 练习类型 |
  | difficulty | string | 否 | 难度等级 |
  | count | number | 否 | 题目数量，默认10 |

- **返回数据**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "exercises": [
        {
          "id": 1,
          "type": "multiple_choice",
          "content": "设事件A和B相互独立，P(A)=0.5，P(B)=0.3，则P(A∪B)=?",
          "options": [
            "0.65",
            "0.8",
            "0.15",
            "0.5"
          ],
          "difficulty": "easy"
        }
      ]
    }
  }
  ```

##### 4.3.3.2 提交练习答案

- **URL**: `/api/v1/student/exercises/submit`
- **方法**: `POST`
- **参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | answers | array | 是 | 答案列表，格式：[{exerciseId: 1, answer: "A"}]
  | duration | number | 是 | 练习时长（秒） |

- **返回数据**:
  ```json
  {
    "code": 200,
    "message": "提交成功",
    "data": {
      "score": 80,
      "correctCount": 8,
      "totalCount": 10,
      "details": [
        {
          "exerciseId": 1,
          "userAnswer": "A",
          "correctAnswer": "A",
          "isCorrect": true,
          "explanation": "解析：因为A和B相互独立，所以P(A∪B)=P(A)+P(B)-P(A)P(B)=0.5+0.3-0.5×0.3=0.65"
        }
      ]
    }
  }
  ```

#### 4.3.4 AI学习助手

- **URL**: `/api/v1/student/ai-assistant/ask`
- **方法**: `POST`
- **参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | question | string | 是 | 问题内容 |
  | context | string | 否 | 问题上下文 |
  | type | string | 否 | 问题类型：theory, exercise, experiment |

- **返回数据**:
  ```json
  {
    "code": 200,
    "message": "回答成功",
    "data": {
      "answer": "条件概率是指在已知事件B发生的条件下，事件A发生的概率，记作P(A|B)。其计算公式为P(A|B)=P(AB)/P(B)，其中P(AB)是事件A和B同时发生的概率，P(B)是事件B发生的概率。",
      "relatedResources": [
        {
          "type": "video",
          "title": "条件概率讲解",
          "url": "https://example.com/video/conditional-probability"
        },
        {
          "type": "experiment",
          "title": "条件概率实验",
          "url": "/student/experiments/conditional"
        }
      ]
    }
  }
  ```

#### 4.3.5 学习成就

- **URL**: `/api/v1/student/achievements`
- **方法**: `GET`
- **参数**: 无
- **返回数据**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "totalScore": 850,
      "ranking": 15,
      "achievements": [
        {
          "id": 1,
          "title": "概率论基础达人",
          "description": "完成所有概率论基础实验",
          "earnedAt": "2026-01-20T12:00:00Z"
        }
      ],
      "recentActivities": [
        {
          "id": 1,
          "type": "experiment",
          "title": "伯努利实验",
          "score": 95,
          "completedAt": "2026-01-30T12:00:00Z"
        }
      ]
    }
  }
  ```

### 4.4 实验数据接口

#### 4.4.1 实验参数配置

- **URL**: `/api/v1/experiments/parameters/{type}`
- **方法**: `GET`
- **参数**: 无
- **返回数据**:
  ```json
  {
    "code": 200,
    "message": "获取成功",
    "data": {
      "type": "bernoulli",
      "parameters": [
        {
          "name": "probability",
          "label": "成功概率",
          "type": "number",
          "min": 0,
          "max": 1,
          "default": 0.5,
          "step": 0.01
        },
        {
          "name": "trials",
          "label": "试验次数",
          "type": "number",
          "min": 1,
          "max": 10000,
          "default": 1000,
          "step": 1
        }
      ]
    }
  }
  ```

#### 4.4.2 实验模拟

- **URL**: `/api/v1/experiments/simulate/{type}`
- **方法**: `POST`
- **参数**:
  | 参数名 | 类型 | 必填 | 描述 |
  |--------|------|------|------|
  | parameters | object | 是 | 实验参数 |
  | trials | number | 是 | 模拟次数 |

- **返回数据**:
  ```json
  {
    "code": 200,
    "message": "模拟成功",
    "data": {
      "results": {
        "successCount": 505,
        "failureCount": 495,
        "successRate": 0.505,
        "distribution": [
          {"value": 0, "count": 0},
          {"value": 1, "count": 505}
        ]
      }
    }
  }
  ```

## 5. 技术实现建议

### 5.1 前端实现

- **API调用封装**：封装统一的API调用函数，处理请求头、响应解析和错误处理
- **认证管理**：使用localStorage或sessionStorage存储token，实现自动登录和登出
- **状态管理**：使用Vuex或Redux管理全局状态
- **数据缓存**：对不频繁变化的数据进行缓存，减少API调用
- **错误处理**：统一处理API错误，提供友好的错误提示

### 5.2 后端实现

- **API框架**：使用Express、Flask或Django REST Framework等框架
- **数据库**：使用MySQL、PostgreSQL或MongoDB存储数据
- **认证**：使用JWT进行身份认证
- **缓存**：使用Redis缓存热点数据
- **日志**：记录详细的API调用日志
- **监控**：监控API性能和错误率

## 6. 安全考虑

- **HTTPS**：使用HTTPS协议保护数据传输
- **参数验证**：对所有请求参数进行严格验证
- **SQL注入防护**：使用参数化查询或ORM
- **XSS防护**：对输入输出进行过滤和转义
- **CSRF防护**：实现CSRF令牌验证
- **速率限制**：对API调用进行速率限制，防止暴力攻击
- **敏感数据加密**：对敏感数据进行加密存储

## 7. 版本控制

- **API版本**：通过URL路径进行版本控制，如`/api/v1/`
- **向后兼容**：确保新版本API向后兼容旧版本
- **废弃通知**：在废弃旧版本API前，提前通知用户

## 8. 文档维护

- **自动生成**：使用工具自动生成API文档
- **实时更新**：确保文档与代码同步更新
- **示例代码**：提供各语言的示例代码
- **测试工具**：集成API测试工具，如Postman或Swagger

## 9. 总结

本接口说明文档定义了邮数工坊平台的前后端统一接口规范，涵盖了用户认证、教师端、学生端和实验数据等核心功能模块。通过严格遵循本规范，可以确保前后端开发的一致性和高效性，为平台的稳定运行和后续扩展奠定基础。

在实际开发过程中，应根据具体需求对接口进行适当调整和扩展，同时保持接口的清晰性和一致性。