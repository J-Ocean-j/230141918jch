// 模拟课程数据
const mockCourses = [
  {
    id: 1,
    name: '数据结构与算法',
    college: '计算机学院',
    credits: 4,
    time: '周一 1-2节,周三 3-4节',
    type: '专业必修',
    description: '学习基本数据结构和算法设计',
    rating: 4.5,
    reviews: []
  },
  {
    id: 2,
    name: '高等数学A',
    college: '数学学院',
    credits: 5,
    time: '周二 1-2节,周四 1-2节',
    type: '公共必修',
    description: '微积分基础理论课程',
    rating: 4.2,
    reviews: []
  },
  {
    id: 3,
    name: '大学英语',
    college: '外国语学院',
    credits: 3,
    time: '周一 3-4节',
    type: '公共必修',
    description: '提升英语听说读写能力',
    rating: 3.8,
    reviews: []
  },
  {
    id: 4,
    name: '大学物理',
    college: '物理学院',
    credits: 4,
    time: '周三 1-2节,周五 3-4节',
    type: '公共必修',
    description: '经典物理学基础理论',
    rating: 4.0,
    reviews: []
  },
  {
    id: 5,
    name: '机器学习导论',
    college: '计算机学院',
    credits: 3,
    time: '周二 3-4节,周四 3-4节',
    type: '专业选修',
    description: '人工智能与机器学习基础',
    rating: 4.7,
    reviews: []
  },
  {
    id: 6,
    name: '线性代数',
    college: '数学学院',
    credits: 3,
    time: '周一 5-6节,周三 5-6节',
    type: '公共必修',
    description: '矩阵理论与线性空间',
    rating: 4.1,
    reviews: []
  },
  {
    id: 7,
    name: '计算机网络',
    college: '计算机学院',
    credits: 3,
    time: '周二 5-6节,周五 1-2节',
    type: '专业必修',
    description: '网络协议与网络编程',
    rating: 4.3,
    reviews: []
  },
  {
    id: 8,
    name: '概率论与数理统计',
    college: '数学学院',
    credits: 3,
    time: '周四 5-6节,周五 5-6节',
    type: '公共必修',
    description: '概率理论与统计方法',
    rating: 4.0,
    reviews: []
  },
  {
    id: 9,
    name: '软件工程',
    college: '计算机学院',
    credits: 3,
    time: '周一 7-8节,周三 7-8节',
    type: '专业选修',
    description: '软件开发方法与项目管理',
    rating: 4.4,
    reviews: []
  },
  {
    id: 10,
    name: '操作系统',
    college: '计算机学院',
    credits: 4,
    time: '周二 7-8节,周四 7-8节',
    type: '专业必修',
    description: '操作系统原理与实践',
    rating: 4.6,
    reviews: []
  },
  {
    id: 11,
    name: '数据库系统',
    college: '计算机学院',
    credits: 3,
    time: '周三 5-6节,周五 7-8节',
    type: '专业必修',
    description: '数据库设计与SQL编程',
    rating: 4.2,
    reviews: []
  },
  {
    id: 12,
    name: 'Web前端开发',
    college: '计算机学院',
    credits: 2,
    time: '周五 5-6节',
    type: '专业选修',
    description: 'HTML、CSS、JavaScript基础',
    rating: 4.5,
    reviews: []
  },
  {
    id: 13,
    name: '离散数学',
    college: '数学学院',
    credits: 3,
    time: '周一 3-4节,周四 5-6节',
    type: '专业必修',
    description: '集合论、图论、逻辑基础',
    rating: 3.9,
    reviews: []
  },
  {
    id: 14,
    name: '编译原理',
    college: '计算机学院',
    credits: 3,
    time: '周二 5-6节,周四 1-2节',
    type: '专业选修',
    description: '编译器设计与实现',
    rating: 4.1,
    reviews: []
  },
  {
    id: 15,
    name: '人工智能导论',
    college: '计算机学院',
    credits: 3,
    time: '周三 7-8节,周五 3-4节',
    type: '专业选修',
    description: 'AI基本概念与应用',
    rating: 4.8,
    reviews: []
  }
];

// 初始化本地存储
export const initLocalStorage = () => {
  if (!localStorage.getItem('courses')) {
    localStorage.setItem('courses', JSON.stringify(mockCourses));
  }
  if (!localStorage.getItem('schedule')) {
    localStorage.setItem('schedule', JSON.stringify({}));
  }
};

// 获取所有课程
export const getCourses = () => {
  const courses = localStorage.getItem('courses');
  return courses ? JSON.parse(courses) : [];
};

// 获取单个课程
export const getCourse = (id) => {
  const courses = getCourses();
  return courses.find(course => course.id === parseInt(id));
};

// 更新课程
export const updateCourse = (updatedCourse) => {
  const courses = getCourses();
  const index = courses.findIndex(course => course.id === updatedCourse.id);
  if (index !== -1) {
    courses[index] = updatedCourse;
    localStorage.setItem('courses', JSON.stringify(courses));
  }
};

// 添加课程
export const addCourse = (newCourse) => {
  const courses = getCourses();
  courses.push(newCourse);
  localStorage.setItem('courses', JSON.stringify(courses));
};

// 删除课程
export const deleteCourse = (courseId) => {
  const courses = getCourses();
  const filteredCourses = courses.filter(course => course.id !== courseId);
  localStorage.setItem('courses', JSON.stringify(filteredCourses));
  
  // 同时从课表中移除该课程
  const schedule = JSON.parse(localStorage.getItem('schedule') || '{}');
  Object.keys(schedule).forEach(timeSlot => {
    if (schedule[timeSlot] === courseId) {
      delete schedule[timeSlot];
    }
  });
  localStorage.setItem('schedule', JSON.stringify(schedule));
};

// 获取课表
export const getSchedule = () => {
  const schedule = localStorage.getItem('schedule');
  return schedule ? JSON.parse(schedule) : {};
};

// 更新课表
export const updateSchedule = (schedule) => {
  localStorage.setItem('schedule', JSON.stringify(schedule));
};

// 添加课程评价
export const addReview = (courseId, review) => {
  const courses = getCourses();
  const course = courses.find(c => c.id === courseId);
  if (course) {
    const newReview = {
      id: Date.now(),
      ...review,
      date: new Date().toISOString()
    };
    course.reviews.push(newReview);
    
    // 重新计算评分
    const totalRating = course.reviews.reduce((sum, r) => sum + r.rating, 0);
    course.rating = course.reviews.length > 0 ? totalRating / course.reviews.length : 0;
    
    updateCourse(course);
  }
};
