import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import TaskModal from './TaskModal';

export default function MainLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [initialDate, setInitialDate] = useState(null);
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/': return 'Dashboard';
      case '/today': return 'Today View';
      case '/upcoming': return 'Upcoming Tasks';
      case '/calendar': return 'Calendar';
      case '/goals': return 'Goals';
      case '/routines': return 'Routines';
      case '/profile': return 'Settings';
      default: return 'Dashboard';
    }
  };

  const openAddModal = (date = null) => {
    setInitialDate(date);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 
        w-64 transform transition-transform duration-200 ease-in-out
        lg:transform-none
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar onNavigate={closeMobileMenu} />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header 
          title={getPageTitle()} 
          onAddTask={openAddModal}
          onMenuClick={toggleMobileMenu}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background-light dark:bg-background-dark">
          <Outlet context={{ openEditModal, openAddModal }} />
        </main>
      </div>
      
      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        task={editingTask}
        initialDate={initialDate}
      />
    </div>
  );
}
