import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';

const Product = Loadable(lazy(() => import('./Product')));

const productRoutes = [
  { path: '/listproduct', element: <Product />, auth: authRoles.admin },
];

export default productRoutes;
