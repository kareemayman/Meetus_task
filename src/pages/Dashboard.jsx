import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const auth = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onLogout = async () => {
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  const user = auth.user;

  return (
    <div className="dashboard-bg">
      <div className="dashboard-card">
        <header className="dashboard-header">
          <h2 className="dashboard-title">
            Welcome, {user?.name ?? '—'}
          </h2>
          <button className="dashboard-logout" onClick={onLogout}>
            Logout
          </button>
        </header>
        <div className="dashboard-info">
          <div><span className="dashboard-label">Email:</span> {user?.email}</div>
          <div><span className="dashboard-label">Status:</span> {user?.status}</div>
          <div><span className="dashboard-label">Organization ID:</span> {user?.organization_id}</div>
          <div><span className="dashboard-label">Shop ID:</span> {user?.shop_id}</div>
          <div><span className="dashboard-label">Roles:</span> {user?.roles?.join(', ')}</div>
          <div><span className="dashboard-label">Referral:</span> {user?.referral}</div>
          <div><span className="dashboard-label">Influencer:</span> {user?.is_influencer ? 'Yes' : 'No'}</div>
          <div><span className="dashboard-label">Addresses:</span> {user?.addresses?.length ? user.addresses.join(', ') : 'None'}</div>
        </div>
      </div>
    </div>
  );
}