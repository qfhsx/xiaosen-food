-- 数据库迁移：添加 video_url 字段到 foods 表
-- 用于存储菜品视频教程链接（支持外部链接如 YouTube、B站，或直接视频文件URL）

ALTER TABLE foods ADD COLUMN video_url VARCHAR(500) DEFAULT NULL COMMENT '视频教程链接' AFTER image;
