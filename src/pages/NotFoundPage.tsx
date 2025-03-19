// src/pages/NotFoundPage.tsx
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-6xl font-bold text-primary-600 dark:text-primary-400">404</div>
      <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">Page Not Found</h1>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">The page you're looking for doesn't exist or has been moved.</p>
     <Link
       to="/"
       className="mt-6 btn-primary px-5 py-3 text-center"
     >
       Go back home
     </Link>
   </div>
 );
};

export default NotFoundPage;