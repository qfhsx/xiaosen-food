-- 测试视频功能的数据
-- 给红烧肉添加一个视频教程链接（使用示例视频）

UPDATE foods 
SET video_url = 'https://www.w3schools.com/html/mov_bbb.mp4'
WHERE name = '红烧肉';

-- 查看修改结果
SELECT name, image, video_url FROM foods WHERE name = '红烧肉';
