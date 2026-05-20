import React from 'react';
import { Palette } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSwitcher = () => {
  const { currentTheme, themes, changeTheme } = useTheme();

  const themeColors = [
    { name: 'red', color: 'bg-red-600', label: '红色' },
    { name: 'orange', color: 'bg-orange-600', label: '橙色' },
    { name: 'yellow', color: 'bg-yellow-600', label: '黄色' },
    { name: 'green', color: 'bg-green-600', label: '绿色' },
    { name: 'cyan', color: 'bg-cyan-600', label: '青色' },
    { name: 'blue', color: 'bg-blue-600', label: '蓝色' },
    { name: 'purple', color: 'bg-purple-600', label: '紫色' },
    { name: 'pink', color: 'bg-pink-600', label: '粉色' },
    { name: 'gray', color: 'bg-gray-600', label: '灰色' },
    { name: 'black', color: 'bg-black', label: '黑色' }
  ];

  return (
    <div className="relative group">
      <button className="p-2 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
        <Palette className="h-5 w-5 text-gray-600" />
      </button>
      
      <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <h3 className="text-sm font-medium text-gray-900 mb-3">选择主题颜色</h3>
        <div className="grid grid-cols-5 gap-2">
          {themeColors.map((theme) => (
            <button
              key={theme.name}
              onClick={() => changeTheme(theme.name)}
              className={`w-8 h-8 rounded-full ${theme.color} ${
                currentTheme === theme.name ? 'ring-2 ring-offset-2 ring-gray-400' : ''
              } hover:scale-110 transition-transform`}
              title={theme.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
