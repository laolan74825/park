import { useIsLogin } from '@/store/index';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// 认证组件，控制访问权限

interface RequireAuthProps {
  allowed: boolean;
  redirectTo: string;
  children: React.ReactNode;
}
function RequireAuth({ allowed, redirectTo, children }: RequireAuthProps) {
  const isLogin = useIsLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin === allowed) {
      navigate(redirectTo, { replace: true });
    }
  }, [isLogin, redirectTo, navigate, allowed]);

  //   如果状态不符合要求，直接返回 null 不渲染子组件，避免闪烁问题
  if (allowed && !isLogin) return null;
  if (!allowed && isLogin) return null;
  return children;
}

export default RequireAuth;
