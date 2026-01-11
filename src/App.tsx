import { useState } from 'react';
import { Layout } from './components/Layout';
import { DailyView } from './components/DailyView';
import { TaskGroupManager } from './components/TaskGroupManager';
import { ProgressView } from './components/ProgressView';

type View = 'daily' | 'groups' | 'progress';

function App() {
  const [currentView, setCurrentView] = useState<View>('daily');

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {currentView === 'daily' && <DailyView />}
      {currentView === 'groups' && <TaskGroupManager />}
      {currentView === 'progress' && <ProgressView />}
    </Layout>
  );
}

export default App;
