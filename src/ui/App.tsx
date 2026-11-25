import { useGame } from '../state/game';
import { StartScreen } from './StartScreen';
import { Sidebar } from './Sidebar';
import { SewingScreen } from './SewingScreen';
import { LaunchReport } from './LaunchReport';
import { Shelf } from './Shelf';
import { Stage } from '../scene/Stage';
import { Plush } from '../scene/Plush';

export function App() {
  const screen = useGame((s) => s.screen);
  const design = useGame((s) => s.design);
  const report = useGame((s) => s.report);

  return (
    <div className="app">
      <header className="top">
        <h1>🧸 Plush Studio</h1>
        {(screen === 'design' || screen === 'report') && <Shelf />}
      </header>
      {screen === 'start' && <StartScreen />}
      {screen === 'design' && (
        <main className="workshop">
          <div className="stage">
            <Stage>
              <Plush design={design} />
            </Stage>
            <p className="stage-hint">Drag to turn it around · tap it for a squish</p>
          </div>
          <Sidebar />
        </main>
      )}
      {screen === 'sewing' && <SewingScreen />}
      {screen === 'report' && report && (
        <main className="results">
          <div className="stage">
            <Stage>
              <Plush design={report.design} />
            </Stage>
          </div>
          <div className="report-wrap">
            <LaunchReport report={report} />
          </div>
        </main>
      )}
    </div>
  );
}
