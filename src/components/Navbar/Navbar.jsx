import { Fragment, useContext } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import Avatar from "@mui/material/Avatar";
import { useLocation, useNavigate } from "react-router-dom";
import CartIcon from "../CartIcon/CartIcon";
import { AuthContext } from "../../context/UserContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      current: location.pathname === "/" ? true : false,
    },
    {
      name: "Transaction",
      href: "/transaction",
      current: location.pathname === "/transaction" ? true : false,
    },
  ];

  const { user, token, dispatch } = useContext(AuthContext);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
  };

  return (
    
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="max-w-9xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  {/* <span className="block lg:block h-8 w-auto">Velx Commerce</span> */}
                  {/* <img
                    className="block lg:hidden h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                    alt="Workflow"
                  />
                  <img
                    className="hidden lg:block h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-logo-indigo-500-mark-white-text.svg"
                    alt="Workflow"
                  /> */}
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <span
                        key={item.name}
                        onClick={() => navigate(item.href)}
                        style={{ cursor: "pointer" }}
                        className={classNames(
                          item.current
                            ? "bg-gray-900 text-white"
                            : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "px-3 py-2 rounded-md text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* <button
                  type="button"
                  className="bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                > */}
                <span className="sr-only">View Cart</span>
                {props.checkout ? (
                  <CartIcon
                    checkout
                    navbarRefresh={props.parentRefresh}
                    setCartNavbarRefresh={props.setCartNavbarRefresh}
                  />
                ) : (
                  <CartIcon
                    navbarRefresh={props.navbarRefresh}
                    setNavbarRefresh={props.setNavbarRefresh}
                  />
                )}
                {/* <CartIcon /> */}
                {/* </button> */}
                {/* Profile dropdown */}
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-gray-800 flex text-sm rounded-full">
                      <span className="sr-only">Open user menu</span>

                      {/* <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      /> */}
                      <Avatar className="h-8 w-8 mr-3">{user.name[0]}</Avatar>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-40">
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={() =>
                              window.open(
                                `http://localhost:3100/session/signin?access-token=${token}`,
                                "_blank",
                                "toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=5000,height=5000"
                              )
                            }
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                            )}
                          >
                            My Store
                          </div>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <div
                          onClick={() => navigate("/my-profile")}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                            )}
                          >
                            Settings
                          </div>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <div
                            onClick={handleLogout}
                            className={classNames(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                            )}
                          >
                            Sign out
                          </div>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
