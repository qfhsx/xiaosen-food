# 构建阶段
FROM golang:1.21-alpine AS builder

WORKDIR /app

# 配置国内镜像源
ENV GOPROXY=https://goproxy.cn,direct
ENV GO111MODULE=on

# 复制所有源码
COPY . .

# 整理依赖并下载
RUN go mod tidy && go mod download

# 构建
RUN CGO_ENABLED=0 GOOS=linux go build -o server cmd/main.go

# 运行阶段
FROM alpine:latest

# 设置UTF-8环境变量
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

WORKDIR /app

# 复制二进制文件
COPY --from=builder /app/server .
COPY --from=builder /app/.env .

# 暴露端口
EXPOSE 8080

# 启动命令
CMD ["./server"]
