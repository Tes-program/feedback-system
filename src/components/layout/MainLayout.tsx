/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/layout/MainLayout.tsx
import { ReactNode, useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  BuildingOfficeIcon,
  HomeIcon,
  ArrowLeftOnRectangleIcon,
  BellIcon,
  ShieldExclamationIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase/config";

interface MainLayoutProps {
  children: ReactNode;
}

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: any;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [manufacturers, setManufacturers] = useState<any[]>([]);
  const [consumers, setConsumers] = useState<any[]>([]);
  const [loadingManufacturers, setLoadingManufacturers] = useState(true);
  const [loadingConsumers, setLoadingConsumers] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get user data from auth context
  const { currentUser, userRole, logout } = useAuth();

  // Fetch notifications
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notificationList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];

      setNotifications(notificationList);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Fetch manufacturers for consumer view
  useEffect(() => {
    if (userRole !== "consumer") {
      setLoadingManufacturers(false);
      return;
    }

    const q = query(
      collection(db, "users"),
      where("role", "==", "manufacturer"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const manufacturerList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setManufacturers(manufacturerList);
      setLoadingManufacturers(false);
    });

    return () => unsubscribe();
  }, [userRole]);

  // Fetch recent consumers for manufacturer view
  useEffect(() => {
    if (userRole !== "manufacturer" || !currentUser) {
      setLoadingConsumers(false);
      return;
    }

    // Get consumers who have submitted feedback to this manufacturer
    const q = query(
      collection(db, "feedback"),
      where("manufacturerId", "==", currentUser.uid),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Extract unique consumer IDs
      const consumerIds = new Set();
      const consumerList: any[] = [];

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (!consumerIds.has(data.consumerId)) {
          consumerIds.add(data.consumerId);
          consumerList.push({
            id: data.consumerId,
            name: data.consumerName,
            feedbackId: doc.id,
          });
        }
      });

      setConsumers(consumerList.slice(0, 5));
      setLoadingConsumers(false);
    });

    return () => unsubscribe();
  }, [userRole, currentUser]);

  // Handle clicks outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setNotificationOpen(false);
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200 dark:border-gray-700">
              <Link to="/" className="flex items-center">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center not-dark:text-black text-black font-bold text-lg">
                  C2M
                </div>
                <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white"></span>
              </Link>
            </div>

            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {userRole === "consumer" ? (
                  <>
                    <Link
                      to="/consumer/dashboard"
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive("/dashboard")
                          ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <HomeIcon
                        className={`mr-3 h-5 w-5 ${
                          isActive("/dashboard")
                            ? "text-primary-500 dark:text-primary-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                      Dashboard
                    </Link>

                    <Link
                      to="/consumer/feedback"
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive("/feedback")
                          ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <ChatBubbleLeftRightIcon
                        className={`mr-3 h-5 w-5 ${
                          isActive("/feedback")
                            ? "text-primary-500 dark:text-primary-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                      Submit Feedback
                    </Link>

                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Your Manufacturers
                      </h3>
                      <div className="mt-2 space-y-1">
                        {loadingManufacturers ? (
                          <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                            Loading...
                          </div>
                        ) : manufacturers.length === 0 ? (
                          <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                            No manufacturers yet
                          </div>
                        ) : (
                          manufacturers.map((manufacturer) => (
                            <Link
                              key={manufacturer.id}
                              to={`/consumer/chat/${manufacturer.id}`}
                              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                isActive(`/chat/${manufacturer.id}`)
                                  ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                            >
                              <BuildingOfficeIcon
                                className={`mr-3 h-5 w-5 ${
                                  isActive(`/chat/${manufacturer.id}`)
                                    ? "text-primary-500 dark:text-primary-400"
                                    : "text-gray-500 dark:text-gray-400"
                                }`}
                              />
                              {manufacturer.companyName}
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Link
                      to="/manufacturer/dashboard"
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive("/dashboard")
                          ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <HomeIcon
                        className={`mr-3 h-5 w-5 ${
                          isActive("/dashboard")
                            ? "text-primary-500 dark:text-primary-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                      Dashboard
                    </Link>

                    <Link
                      to="/manufacturer/manage-products"
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive("/manage-products")
                          ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <BuildingOfficeIcon
                        className={`mr-3 h-5 w-5 ${
                          isActive("/manage-products")
                            ? "text-primary-500 dark:text-primary-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                      Manage Products
                    </Link>

                    {/* Add this to the desktop navigation for both consumer and manufacturer */}
                    <Link
                      to="/reports"
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive("/reports")
                          ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <ShieldExclamationIcon
                        className={`mr-3 h-5 w-5 ${
                          isActive("/reports")
                            ? "text-primary-500 dark:text-primary-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      />
                      Reports
                    </Link>

                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Recent Feedback
                      </h3>
                      <div className="mt-2 space-y-1">
                        {loadingConsumers ? (
                          <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                            Loading...
                          </div>
                        ) : consumers.length === 0 ? (
                          <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                            No feedback yet
                          </div>
                        ) : (
                          consumers.map((consumer) => (
                            <Link
                              key={consumer.id}
                              to={`/manufacturer/chat/${consumer.feedbackId}`}
                              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                                isActive(`/chat/${consumer.feedbackId}`)
                                  ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                            >
                              <UserCircleIcon
                                className={`mr-3 h-5 w-5 ${
                                  isActive(`/chat/${consumer.feedbackId}`)
                                    ? "text-primary-500 dark:text-primary-400"
                                    : "text-gray-500 dark:text-gray-400"
                                }`}
                              />
                              {consumer.name}
                            </Link>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </nav>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium">
                      {currentUser?.displayName?.charAt(0) || "?"}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {currentUser?.displayName || "User"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {userRole || "User"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-4 flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 flex flex-col w-64 lg:hidden z-30 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="flex items-center h-16 flex-shrink-0 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between w-full">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                C2m
              </div>
              <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white"></span>
            </Link>
            <button
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {userRole === "consumer" ? (
              <>
                <Link
                  to="/consumer/dashboard"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive("/dashboard")
                      ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <HomeIcon
                    className={`mr-3 h-5 w-5 ${
                      isActive("/dashboard")
                        ? "text-primary-500 dark:text-primary-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  Dashboard
                </Link>

                <Link
                  to="/consumer/feedback"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive("/feedback")
                      ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <ChatBubbleLeftRightIcon
                    className={`mr-3 h-5 w-5 ${
                      isActive("/feedback")
                        ? "text-primary-500 dark:text-primary-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  Submit Feedback
                </Link>

                {/* Same manufacturer list as desktop... */}
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Your Manufacturers
                  </h3>
                  <div className="mt-2 space-y-1">
                    {loadingManufacturers ? (
                      <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                        Loading...
                      </div>
                    ) : manufacturers.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                        No manufacturers yet
                      </div>
                    ) : (
                      manufacturers.map((manufacturer) => (
                        <Link
                          key={manufacturer.id}
                          to={`/consumer/chat/${manufacturer.id}`}
                          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                            isActive(`/chat/${manufacturer.id}`)
                              ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <BuildingOfficeIcon
                            className={`mr-3 h-5 w-5 ${
                              isActive(`/chat/${manufacturer.id}`)
                                ? "text-primary-500 dark:text-primary-400"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          />
                          {manufacturer.name}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Manufacturer links... */}
                <Link
                  to="/manufacturer/dashboard"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive("/dashboard")
                      ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <HomeIcon
                    className={`mr-3 h-5 w-5 ${
                      isActive("/dashboard")
                        ? "text-primary-500 dark:text-primary-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  Dashboard
                </Link>

                <Link
                  to="/manufacturer/manage-products"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive("/manage-products")
                      ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <BuildingOfficeIcon
                    className={`mr-3 h-5 w-5 ${
                      isActive("/manage-products")
                        ? "text-primary-500 dark:text-primary-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  Manage Products
                </Link>

                {/* Consumer list... */}
                <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Recent Feedback
                  </h3>
                  <div className="mt-2 space-y-1">
                    {loadingConsumers ? (
                      <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                        Loading...
                      </div>
                    ) : consumers.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                        No feedback yet
                      </div>
                    ) : (
                      consumers.map((consumer) => (
                        <Link
                          key={consumer.id}
                          to={`/manufacturer/chat/${consumer.feedbackId}`}
                          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                            isActive(`/chat/${consumer.feedbackId}`)
                              ? "bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300"
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <UserCircleIcon
                            className={`mr-3 h-5 w-5 ${
                              isActive(`/chat/${consumer.feedbackId}`)
                                ? "text-primary-500 dark:text-primary-400"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          />
                          {consumer.name}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium">
                  {currentUser?.displayName?.charAt(0) || "?"}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentUser?.displayName || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {userRole || "User"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <button
            type="button"
            className="lg:hidden px-4 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {userRole === "consumer"
                  ? "Consumer Dashboard"
                  : "Manufacturer Dashboard"}
              </h1>
            </div>

            <div className="ml-4 flex items-center md:ml-6" ref={dropdownRef}>
              {/* Notifications */}
              <div className="relative mr-4">
                <button
                  className="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotificationOpen(!notificationOpen);
                    setUserDropdownOpen(false);
                  }}
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center text-xs text-white">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </button>

                {/* Notification dropdown */}
                {notificationOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700">
                    <div className="py-2 px-4">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="py-4 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                              !notification.read
                                ? "bg-blue-50 dark:bg-blue-900/10"
                                : ""
                            }`}
                          >
                            <p className="text-sm text-gray-800 dark:text-gray-200">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <div className="py-2 px-4">
                        <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
                          Mark all as read
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User dropdown */}
              <div className="relative">
                <button
                  className="flex items-center max-w-xs text-sm rounded-full focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUserDropdownOpen(!userDropdownOpen);
                    setNotificationOpen(false);
                  }}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-medium">
                    {currentUser?.displayName?.charAt(0) || "?"}
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                    {currentUser?.displayName || "User"}
                  </span>
                </button>

                {/* User dropdown menu */}
                {userDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Link
                        to={
                          userRole === "consumer"
                            ? "/consumer/profile"
                            : "/manufacturer/profile"
                        }
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Your Profile
                      </Link>
                      {/* <Link 
                       to={userRole === 'consumer' ? '/consumer/settings' : '/manufacturer/settings'} 
                       className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                       onClick={() => setUserDropdownOpen(false)}
                     >
                       Settings
                     </Link> */}
                      <button
                        onClick={() => {
                          handleLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
