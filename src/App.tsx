import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link, useHistory } from 'react-router-dom';
import VideoExplore from './pages/VideoExplore';
import VideoPlayerPage from './pages/VideoPlayerPage';
import CreatorDashboard from './pages/CreatorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { User } from './types';
import { ProtectedRoute } from './ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Button } from 'antd';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 main-container">
        <Navbar />
        <main className="py-8 app-container">
          <Switch>
            <Route exact path="/" component={VideoExplore} />
            <Route path="/video/:id" component={VideoPlayerPage} />
            <ProtectedRoute path="/creator" component={CreatorDashboard}  role='creator'/>
            <ProtectedRoute path="/admin" component={AdminDashboard} role='admin' />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
          </Switch>
        </main>
      </div>
    </Router>
  );
};

export default App;