import React, { useState, useEffect } from 'react';
import { BookOpen, Sparkles, Clock, Star } from 'lucide-react';
import { getCourses, initLocalStorage } from '../utils/storage';
import { useTheme } from '../contexts/ThemeContext';

const Index = () => {
  const [major, setMajor] = useState('');
  const [interests, setInterests] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  const majors = ['计算机', '数学', '英语', '物理'];
  const interestOptions = ['轻松水课', '高分友好', '干货满满', '老师nice', '期末论文'];

  useEffect(() => {
    // 初始化本地存储
    if (!localStorage.getItem('courses')) {
      initLocalStorage();
    }
  }, []);

  const handleInterestToggle = (interest) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const generateRecommendations = async () => {
    if (!major || interests.length === 0) {
      alert('请选择专业和兴趣标签');
      return;
    }

    setLoading(true);
    
    // 模拟AI推荐延迟
    await new Promise(resolve => setTimeout(resolve, 2000));

    const courses = getCourses();
    
    // 根据专业和兴趣筛选课程
    let filteredCourses = courses.filter(course => {
      const majorMatch = course.college.includes(major) || major === '英语' && course.college.includes('外国语');
      return majorMatch;
    });

    // 根据兴趣进一步筛选
    if (interests.includes('高分友好')) {
      filteredCourses = filteredCourses.filter(course => course.rating >= 4.0);
    }
    if (interests.includes('轻松水课')) {
      filteredCourses = filteredCourses.filter(course => course.credits <= 3);
    }
    if (interests.includes('干货满满')) {
      filteredCourses = filteredCourses.filter(course => course.credits >= 4);
    }

    // 生成两套推荐方案
    const shuffled = [...filteredCourses].sort(() => 0.5 - Math.random());
    const plan1 = shuffled.slice(0, 4);
    const plan2 = shuffled.slice(4, 8);

    const generatePlanWithReasons = (courses, planName) => ({
      name: planName,
      courses: courses.map(course => ({
        ...course,
        reason: generateReason(course, interests)
      }))
    });

    setRecommendations([
      generatePlanWithReasons(plan1, '推荐方案一'),
      generatePlanWithReasons(plan2, '推荐方案二')
    ]);

    setLoading(false);
  };

  const generateReason = (course, interests) => {
    const reasons = [];
    
    if (course.rating >= 4.5) {
      reasons.push('课程评分很高,教学质量优秀');
    }
    if (interests.includes('高分友好') && course.rating >= 4.0) {
      reasons.push('符合高分友好要求,容易获得好成绩');
    }
    if (interests.includes('轻松水课') && course.credits <= 3) {
      reasons.push('学分较少,学习压力相对较小');
    }
    if (interests.includes('干货满满') && course.credits >= 4) {
      reasons.push('学分较多,内容丰富有深度');
    }
    if (course.type === '专业必修') {
      reasons.push('专业核心课程,对专业发展很重要');
    }
    
    return reasons.length > 0 ? reasons.join(';') : '综合评估推荐的优质课程';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.gradient}`}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* 头部标题 */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className={`h-12 w-12 ${theme.primaryText} mr-3`} />
            <h1 className="text-4xl font-bold text-gray-900">AI选课决策助手</h1>
          </div>
          <p className="text-xl text-gray-600">CourseMate - 让AI帮你选择最适合的课程</p>
        </div>

        {/* 选课表单 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8 hover:shadow-xl transition-shadow duration-300">
          <div className="grid md:grid-cols-2 gap-8">
            {/* 专业选择 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                选择专业
              </label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">请选择专业</option>
                {majors.map(major => (
                  <option key={major} value={major}>{major}</option>
                ))}
              </select>
            </div>

            {/* 兴趣标签 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                兴趣标签(可多选)
              </label>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map(interest => (
                  <button
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      interests.includes(interest)
                        ? `${theme.primary} text-white`
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 生成按钮 */}
          <div className="mt-8 text-center">
            <button
              onClick={generateRecommendations}
              disabled={loading}
              className={`inline-flex items-center px-6 py-3 ${theme.primary} text-white font-medium rounded-lg ${theme.primaryHover} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  AI正在分析中...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  生成选课方案
                </>
              )}
            </button>
          </div>
        </div>

        {/* 推荐结果 */}
        {recommendations.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
              为您推荐的选课方案
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {recommendations.map((plan, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-2" />
                    {plan.name}
                  </h3>
                  <div className="space-y-4">
                    {plan.courses.map((course) => (
                      <div key={course.id} className={`border-l-4 ${theme.primaryBorder} pl-4`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900">{course.name}</h4>
                          <span className="text-sm text-gray-500">{course.credits}学分</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.time}
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{course.reason}</p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm text-gray-600">{course.rating.toFixed(1)}分</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
