import { ProvideAuth } from './hook/auth';
import Router from './router';
import './App.css';

export default () => {
  return (
    <ProvideAuth>
      <Router />
    </ProvideAuth>
  );
}