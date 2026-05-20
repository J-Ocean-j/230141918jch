import { Link } from 'react-router-dom';
import { getCourses, addCourse, deleteCourse } from '../utils/storage';
import { Search, Trash2, Lock, Filter, Star, BookOpen, Unlock, Plus, Clock } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const CourseBrowser = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [newCourse, setNewCourse] = useState({
    id: '',
    name: '',
    college: '',
    credits: '',
    time: '',
    type: '',
    description: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const { theme } = useTheme();

  const ADMIN_PASSWORD = 'admin123'; // 管理员密码

  const colleges = ['计算机学院', '数学学院', '外国语学院', '物理学院'];
  const types = ['专业必修', '专业选修', '公共必修'];

  // 学院颜色映射
  const collegeColors = {
    '计算机学院': 'bg-blue-50 border-blue-200',
    '数学学院': 'bg-green-50 border-green-200',
    '外国语学院': 'bg-purple-50 border-purple-200',
    '物理学院': 'bg-yellow-50 border-yellow-200'
  };

  useEffect(() => {
    const coursesData = getCourses();
    setCourses(coursesData);
    setFilteredCourses(coursesData);
  }, []);

  useEffect(() => {
    let filtered = [...courses];

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 学院过滤
    if (collegeFilter) {
      filtered = filtered.filter(course => course.college === collegeFilter);
    }

    // 类型过滤
    if (typeFilter) {
      filtered = filtered.filter(course => course.type === typeFilter);
    }

    // 时间过滤
    if (timeFilter) {
      filtered = filtered.filter(course =>
        course.time.toLowerCase().includes(timeFilter.toLowerCase())
      );
    }

    // 排序
    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'college') {
      filtered.sort((a, b) => a.college.localeCompare(b.college));
    }

    setFilteredCourses(filtered);
  }, [searchTerm, collegeFilter, typeFilter, timeFilter, sortBy, courses]);

  const handleAddCourse = (e) => {
    e.preventDefault();
    
    // 验证表单
    if (!newCourse.id || !newCourse.name || !newCourse.college || !newCourse.credits || 
        !newCourse.time || !newCourse.type || !newCourse.description) {
      alert('请填写所有字段');
      return;
    }

    // 检查编号是否已存在
    const existingCourse = courses.find(course => course.id === parseInt(newCourse.id));
    if (existingCourse) {
      alert('该课程编号已存在，请使用其他编号');
      return;
    }

    // 创建新课程
    const course = {
      id: parseInt(newCourse.id),
      name: newCourse.name,
      college: newCourse.college,
      credits: parseInt(newCourse.credits),
      time: newCourse.time,
      type: newCourse.type,
      description: newCourse.description,
      rating: 0, // 新课程初始评分为0
      reviews: []
    };

    // 添加课程到存储
    addCourse(course);
    
    // 更新本地状态
    const updatedCourses = [...courses, course];
    setCourses(updatedCourses);
    setFilteredCourses(updatedCourses);
    
    // 重置表单
    setNewCourse({
      id: '',
      name: '',
      college: '',
      credits: '',
      time: '',
      type: '',
      description: ''
    });
    
    // 关闭表单
    setShowAddForm(false);
    
    alert('课程添加成功!');
  };

  const handleDeleteClick = (courseId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCourseToDelete(courseId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (courseToDelete) {
      try {
        deleteCourse(courseToDelete);
        const updatedCourses = courses.filter(course => course.id !== courseToDelete);
        setCourses(updatedCourses);
        setFilteredCourses(updatedCourses);
        alert('课程已删除');
      } catch (error) {
        alert('删除失败，请重试');
        console.error('删除课程错误:', error);
      } finally {
        setShowDeleteConfirm(false);
        setCourseToDelete(null);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setCourseToDelete(null);
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword('');
      alert('管理员登录成功');
    } else {
      alert('密码错误，请重试');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setShowAddForm(false);
  };

  const CourseCard = ({ course }) => (
    <div className={`rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border ${collegeColors[course.college] || 'bg-white border-gray-200'} relative`}>
      {isAdmin && (
        <button
          onClick={(e) => handleDeleteClick(course.id, e)}
          className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
          title="删除课程"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
      
      <Link to={`/course/${course.id}`} className="block">
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">编号: {course.id}</div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {course.name}
            </h3>
          </div>
          <span className="text-sm text-blue-600 font-medium">{course.credits}学分</span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <BookOpen className="h-4 w-4 mr-2" />
            <span>{course.college}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>{course.time}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              course.type === '专业必修' ? 'bg-red-100 text-red-800' :
              course.type === '专业选修' ? 'bg-blue-100 text-blue-800' :
              'bg-green-100 text-green-800'
            }`}>
              {course.type}
            </span>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm text-gray-600">
                {course.rating > 0 ? course.rating.toFixed(1) : '暂无评分'}
              </span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-700 line-clamp-2">{course.description}</p>
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">课程浏览</h1>
            <p className="text-gray-600">浏览所有可用课程,找到最适合你的课程</p>
          </div>
          <div className="flex space-x-3">
            {isAdmin ? (
              <button
                onClick={handleAdminLogout}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                <Unlock className="h-4 w-4 mr-2" />
                退出管理
              </button>
            ) : (
              <button
                onClick={() => setShowAdminLogin(true)}
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                <Lock className="h-4 w-4 mr-2" />
                管理员登录
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className={`inline-flex items-center px-4 py-2 ${theme.primary} text-white font-medium rounded-lg ${theme.primaryHover} transition-colors`}
              >
                <Plus className="h-4 w-4 mr-2" />
                添加课程
              </button>
            )}
          </div>
        </div>

        {/* 管理员登录对话框 */}
        {showAdminLogin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">管理员登录</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  请输入管理员密码
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入密码"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminPassword('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleAdminLogin}
                  className={`px-4 py-2 ${theme.primary} text-white rounded-lg ${theme.primaryHover}`}
                >
                  登录
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 删除确认对话框 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold text-gray-900 mb-4">确认删除</h2>
              <p className="text-gray-700 mb-6">确定要删除这门课程吗？此操作不可恢复。</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 添加课程表单 */}
        {showAddForm && isAdmin && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">添加新课程</h2>
            <form onSubmit={handleAddCourse} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  课程编号
                </label>
                <input
                  type="number"
                  value={newCourse.id}
                  onChange={(e) => setNewCourse({...newCourse, id: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入课程编号"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  课程名称
                </label>
                <input
                  type="text"
                  value={newCourse.name}
                  onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  开课学院
                </label>
                <select
                  value={newCourse.college}
                  onChange={(e) => setNewCourse({...newCourse, college: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">请选择学院</option>
                  {colleges.map(college => (
                    <option key={college} value={college}>{college}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  学分
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newCourse.credits}
                  onChange={(e) => setNewCourse({...newCourse, credits: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  上课时间
                </label>
                <input
                  type="text"
                  value={newCourse.time}
                  onChange={(e) => setNewCourse({...newCourse, time: e.target.value})}
                  placeholder="例如: 周一 1-2节,周三 3-4节"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  课程类型
                </label>
                <select
                  value={newCourse.type}
                  onChange={(e) => setNewCourse({...newCourse, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">请选择类型</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  课程描述
                </label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="md:col-span-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 ${theme.primary} text-white rounded-lg ${theme.primaryHover}`}
                >
                  添加课程
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8 hover:shadow-lg transition-shadow duration-300">
          <div className="grid md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索课程名称或描述"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有学院</option>
              {colleges.map(college => (
                <option key={college} value={college}>{college}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">所有类型</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="按时间筛选(如:周一)"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="rating">按评分排序</option>
              <option value="college">按学院排序</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">找到 {filteredCourses.length} 门课程</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">没有找到符合条件的课程</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseBrowser;
