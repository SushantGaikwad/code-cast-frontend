import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  role: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, role, ...rest }) => {
  const token = localStorage.getItem('token');
  let userRole = '';
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    userRole = payload.role;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        token && userRole === role ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};
