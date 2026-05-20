import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, BookOpen, User, Calendar, Camera } from 'lucide-react';
import { getCourse, addReview } from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
    screenshot: null
  });
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const courseData = getCourse(id);
    setCourse(courseData);
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      alert('请输入评价内容');
      return;
    }

    setLoading(true);

    try {
      let screenshotBase64 = null;
      if (reviewForm.screenshot) {
        screenshotBase64 = await convertToBase64(reviewForm.screenshot);
      }

      const review = {
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        screenshot: screenshotBase64,
        userName: '匿名用户'
      };

      addReview(parseInt(id), review);
      
      const updatedCourse = getCourse(id);
      setCourse(updatedCourse);
      
      setReviewForm({
        rating: 5,
        comment: '',
        screenshot: null
      });

      alert('评价提交成功!');
    } catch (error) {
      alert('提交失败,请重试');
    } finally {
      setLoading(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert('图片大小不能超过1MB');
        return;
      }
      setReviewForm(prev => ({ ...prev, screenshot: file }));
    }
  };

  const generateAIComment = (course) => {
    const comments = [
      `《${course.name}》是一门非常实用的课程,老师讲解清晰,内容丰富。`,
      `${course.name}课程内容充实,对专业能力提升很有帮助。`,
      `这门${course.name}课程设置合理,理论与实践结合得很好。`,
      `${course.name}是我上过最有趣的课程之一,强烈推荐!`,
      `通过${course.name}的学习,我对这个领域有了更深的理解。`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/courses" className={`inline-flex items-center ${theme.primaryText} hover:opacity-80 mb-6`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回课程列表
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.name}</h1>
              <div className="flex items-center space-x-4 text-gray-600">
                <span className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {course.college}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {course.time}
                </span>
                <span className={`font-medium ${theme.primaryText}`}>{course.credits}学分</span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center mb-2">
                <Star className="h-5 w-5 text-yellow-500 mr-1" />
                <span className="text-2xl font-bold">{course.rating.toFixed(1)}</span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                course.type === '专业必修' ? 'bg-red-100 text-red-800' :
                course.type === '专业选修' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {course.type}
              </span>
            </div>
          </div>

          <p className="text-gray-700 mb-6">{course.description}</p>

          <div className={`${theme.primaryBg} rounded-lg p-4 mb-6`}>
            <h3 className={`font-semibold ${theme.primaryText} mb-2`}>AI评价摘要</h3>
            <p className="text-gray-800">{generateAIComment(course)}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">用户评价</h2>
          
          {course.reviews && course.reviews.length > 0 ? (
            <div className="space-y-6">
              {course.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <User className="h-8 w-8 text-gray-400 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{review.userName}</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-500' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(review.date).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                  {review.screenshot && (
                    <img
                      src={review.screenshot}
                      alt="评价截图"
                      className="max-w-xs rounded-lg border"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">暂无评价,快来发表第一个评价吧!</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">发表评价</h2>
          
          <form onSubmit={handleReviewSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                评分
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= reviewForm.rating ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-gray-600">{reviewForm.rating}星</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                评价内容
              </label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="分享你对这门课程的看法..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                上传截图(可选,最大1MB)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotChange}
                  className="hidden"
                  id="screenshot-upload"
                />
                <label
                  htmlFor="screenshot-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  选择图片
                </label>
                {reviewForm.screenshot && (
                  <span className="text-sm text-gray-600">
                    {reviewForm.screenshot.name}
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center px-6 py-3 ${theme.primary} text-white font-medium rounded-lg ${theme.primaryHover} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    提交中...
                  </>
                ) : (
                  '提交评价'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
