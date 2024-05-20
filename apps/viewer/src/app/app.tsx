import { UiFooter } from '@tunefields/shared-ui';
import NxWelcome from './nx-welcome';

export function App() {
  return (
    <div>
      <style jsx>{`
        /** your style here **/
      `}</style>

      <NxWelcome title="viewer" />
      <UiFooter />
    </div>
  );
}

export default App;
