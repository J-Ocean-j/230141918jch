import { DndProvider, useDrop, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { getCourses, updateSchedule, getSchedule } from '../utils/storage';
import { Download, Trash2, Plus, AlertTriangle, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { useTheme } from '../contexts/ThemeContext';

const MySchedule = () => {
  const [schedule, setSchedule] = useState({});
  const [courses] = useState(getCourses());
  const [conflicts, setConflicts] = useState([]);
  const [conflictMessage, setConflictMessage] = useState('');
  const [showConflictAlert, setShowConflictAlert] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const savedSchedule = getSchedule();
    setSchedule(savedSchedule);
  }, []);

  useEffect(() => {
    checkConflicts();
  }, [schedule]);

  const checkConflicts = () => {
    const timeSlots = {};
    const newConflicts = [];

    Object.entries(schedule).forEach(([slot, courseId]) => {
      if (timeSlots[slot]) {
        newConflicts.push(slot);
      }
      timeSlots[slot] = courseId;
    });

    setConflicts(newConflicts);
  };

  const timeSlots = [
    '周一 1-2节', '周一 3-4节', '周一 5-6节', '周一 7-8节',
    '周二 1-2节', '周二 3-4节', '周二 5-6节', '周二 7-8节',
    '周三 1-2节', '周三 3-4节', '周三 5-6节', '周三 7-8节',
    '周四 1-2节', '周四 3-4节', '周四 5-6节', '周四 7-8节',
    '周五 1-2节', '周五 3-4节', '周五 5-6节', '周五 7-8节'
  ];

  const getCourseById = (id) => {
    return courses.find(course => course.id === id);
  };

  const exportSchedule = async () => {
    const scheduleElement = document.getElementById('schedule-table');
    if (scheduleElement) {
      try {
        const canvas = await html2canvas(scheduleElement, {
          backgroundColor: '#ffffff',
          scale: 2
        });
        const link = document.createElement('a');
        link.download = '我的课表.png';
        link.href = canvas.toDataURL();
        link.click();
      } catch (error) {
        alert('导出失败,请重试');
      }
    }
  };

  const DraggableCourse = ({ course }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'course',
      item: { id: course.id, name: course.name },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={drag}
        className={`p-3 bg-white rounded-lg shadow-sm border cursor-move hover:shadow-md transition-shadow ${
          isDragging ? 'opacity-50' : ''
        }`}
      >
        <div className="font-medium text-sm">{course.name}</div>
        <div className="text-xs text-gray-500">{course.credits}学分</div>
      </div>
    );
  };

  const TimeSlot = ({ timeSlot }) => {
    const courseId = schedule[timeSlot];
    const course = courseId ? getCourseById(courseId) : null;
    const hasConflict = conflicts.includes(timeSlot);

    const [{ isOver }, drop] = useDrop({
      accept: 'course',
      drop: (item) => {
        // 检查目标时间段是否已有课程
        if (schedule[timeSlot]) {
          const existingCourse = getCourseById(schedule[timeSlot]);
          setConflictMessage(`该时间段已有课程: ${existingCourse.name}`);
          setShowConflictAlert(true);
          return;
        }

        const newSchedule = { ...schedule };
        
        // 移除课程在原位置
        Object.keys(newSchedule).forEach(slot => {
          if (newSchedule[slot] === item.id) {
            delete newSchedule[slot];
          }
        });

        // 添加到新位置
        newSchedule[timeSlot] = item.id;
        setSchedule(newSchedule);
        updateSchedule(newSchedule);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    const removeCourse = () => {
      const newSchedule = { ...schedule };
      delete newSchedule[timeSlot];
      setSchedule(newSchedule);
      updateSchedule(newSchedule);
    };

    return (
      <div
        ref={drop}
        className={`min-h-[80px] p-2 border-2 border-dashed rounded-lg transition-colors ${
          hasConflict
            ? 'border-red-500 bg-red-50'
            : isOver
            ? `${theme.primaryBorder} ${theme.primaryBg}`
            : 'border-gray-300 bg-gray-50'
        }`}
      >
        {course ? (
          <div className={`p-2 rounded-lg text-white text-sm ${
            hasConflict ? 'bg-red-500' : theme.primary
          } relative`}>
            <button
              onClick={removeCourse}
              className="absolute top-1 right-1 p-0.5 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30"
            >
              <X className="h-3 w-3" />
            </button>
            <div className="font-medium pr-4">{course.name}</div>
            <div className="text-xs opacity-90">{course.credits}学分</div>
            {hasConflict && (
              <div className="flex items-center text-xs mt-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                时间冲突
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            <Plus className="h-4 w-4 mr-1" />
            拖拽课程到此处
          </div>
        )}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* 页面标题 */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">我的课表</h1>
              <p className="text-gray-600">拖拽课程到课表中,支持导出为图片</p>
            </div>
            <button
              onClick={exportSchedule}
              className={`inline-flex items-center px-4 py-2 ${theme.primary} text-white font-medium rounded-lg ${theme.primaryHover} transition-colors`}
            >
              <Download className="h-4 w-4 mr-2" />
              导出课表
            </button>
          </div>

          {/* 冲突提示对话框 */}
          {showConflictAlert && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" />
                  <h2 className="text-xl font-bold text-gray-900">时间冲突提示</h2>
                </div>
                <p className="text-gray-700 mb-6">{conflictMessage}</p>
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowConflictAlert(false)}
                    className={`px-4 py-2 ${theme.primary} text-white rounded-lg ${theme.primaryHover}`}
                  >
                    确定
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-4 gap-8">
            {/* 课程列表 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">可选课程</h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {courses.map(course => (
                    <DraggableCourse key={course.id} course={course} />
                  ))}
                </div>
              </div>
            </div>

            {/* 课表 */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div id="schedule-table">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="w-20 p-2 text-left text-sm font-medium text-gray-500">时间</th>
                        <th className="p-2 text-center text-sm font-medium text-gray-500">第1-2节</th>
                        <th className="p-2 text-center text-sm font-medium text-gray-500">第3-4节</th>
                        <th className="p-2 text-center text-sm font-medium text-gray-500">第5-6节</th>
                        <th className="p-2 text-center text-sm font-medium text-gray-500">第7-8节</th>
                      </tr>
                    </thead>
                    <tbody>
                      {['周一', '周二', '周三', '周四', '周五'].map(day => (
                        <tr key={day}>
                          <td className="p-2 font-medium text-gray-900">{day}</td>
                          <td className="p-2">
                            <TimeSlot timeSlot={`${day} 1-2节`} />
                          </td>
                          <td className="p-2">
                            <TimeSlot timeSlot={`${day} 3-4节`} />
                          </td>
                          <td className="p-2">
                            <TimeSlot timeSlot={`${day} 5-6节`} />
                          </td>
                          <td className="p-2">
                            <TimeSlot timeSlot={`${day} 7-8节`} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 冲突提示 */}
              {conflicts.length > 0 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-red-700 font-medium">
                      检测到 {conflicts.length} 个时间冲突,请调整课表
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default MySchedule;
