import { Refine, AuthBindings, Authenticated } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  notificationProvider, ErrorComponent,
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings from "@refinedev/react-router-v6";
import {
  NavigateToResource,
  CatchAllNavigate,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { dataProvider } from "./rest-data-provider";
//swizzled the simple-rest api data provider

import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { ColorModeContextProvider } from "./contexts/color-mode";

import UserList from "./users/index"
import UserCreate from "./users/create"
import UserShow from "./users/show"
import UserEdit from "./users/edit"

import CourseList from "./courses/index"
import CourseCreate from "./courses/create"
import CourseShow from "./courses/show"
import CourseEdit from "./courses/edit/edit"

import ThemedLayout from "components/themedLayout";
import LoginPage from "./pages/login-page"
import ShopPage from "./pages/shop-page";
import CoursePreviewPage from "./pages/course-preview-page";
import CourseContentPage from "./pages/course-content-page";

import { ShoppingCartProvider } from "components/shoppingCartContext";
import ShoppingCartPage from "./pages/shopping-cart-page"
import { getUser } from "api/courses";
import { IUser } from "models";
import { useQuery } from "@tanstack/react-query"


const App: React.FC = () => {

  const { isLoading, user, logout, getIdTokenClaims } = useAuth0();
  const userQueryData = useQuery<IUser>({
    queryKey: ['users', user?.email],
    queryFn: () => getUser(user),
  })

  if (isLoading) {
    return <span>loading...</span>;
  }

  if (userQueryData.status === "loading") return <h1>Loading...</h1>;
  if (userQueryData.status === "error") return <h1>{JSON.stringify(userQueryData.error)}</h1>

  const userData: IUser = userQueryData.data;

  const authProvider: AuthBindings = {
    login: async () => ({ success: true }),
    logout: async () => {
      logout({ logoutParams: { returnTo: window.location.origin } });
      return {
        success: true,
      };
    },
    onError: async (error) => {
      console.error("onError", error);
      return { error };
    },
    check: async () => {
      try {
        const token = await getIdTokenClaims();
        if (token) {
          axios.defaults.headers.common = {
            Authorization: `Bearer ${token.__raw}`,
          };
          console.log("authenticated")
          return {
            authenticated: true,
            redirectTo: "/dashboard/courses",
          };
        } else {
          return {
            authenticated: false,
            error: {
              message: "Check failed",
              name: "Token not found",
            },
            redirectTo: "/login",
            logout: true,
          };
        }
      } catch (error: any) {
        return {
          authenticated: false,
          error: new Error(error),
          redirectTo: "/login",
          logout: true,
        };
      }
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      if (user) {
        console.log("user=>", user)
        console.log("userData=>", userData)
        const newUserData = {
          ...user, ...userData,
          avatar: user.picture,
        }
        return newUserData;
      }
      return null;
    },
  };

  getIdTokenClaims().then((token) => {
    if (token) {
      axios.defaults.headers.common = {
        Authorization: `Bearer ${token.__raw}`,
      };
    }
  });

  const DATA_URI = (process.env.NODE_ENV === 'production') ? process.env.REACT_APP_PRODUCTION_URI : process.env.REACT_APP_DEV_URI;
  console.log("DATA_URI",DATA_URI)

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <ShoppingCartProvider items={[]}>     
              <Refine
                routerProvider={routerBindings}
                authProvider={authProvider}
                dataProvider={DATA_URI ? {
                  default: dataProvider(DATA_URI),
                } : {
                  default: dataProvider("https://api.fake-rest.refine.dev"),
                }}
                notificationProvider={notificationProvider}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                }}
                resources={[
                  {
                    name: 'courses',
                    list: '/dashboard/courses',
                    show: '/dashboard/courses/show/:id',
                    create: '/dashboard/courses/create',
                    edit: '/dashboard/courses/edit/:id',
                    meta: {
                      canDelete: true,
                      dataProviderName: "default",
                    },
                  },
                  {
                    name: 'users',
                    list: '/dashboard/users',
                    show: '/dashboard/users/show/:id',
                    create: '/dashboard/users/create',
                    edit: '/dashboard/users/edit/:id',
                    meta: {
                      canDelete: true,
                      dataProviderName: "default",
                    },
                  },
                ]}
              >
                <Routes>
                  <Route path="/"
                    element={
                      <ThemedLayout>
                        <Outlet />
                      </ThemedLayout>
                    }
                  >
                    <Route path="/" element={<ShopPage />} />
                    <Route path="/courses/preview/:id" element={<CoursePreviewPage />} />
                    <Route path="/courses/content/:id" element={<CourseContentPage />} />
                    <Route path="/cart" element={<ShoppingCartPage />} />
                    <Route path="/login" element={<LoginPage />} />
                  </Route>

                  <Route path="/dashboard"
                    element={
                      <Authenticated fallback={<CatchAllNavigate to="/login" />}>
                        <ThemedLayout>
                          <Outlet />
                        </ThemedLayout>
                      </Authenticated>
                    }
                  >
                    <Route index element={<NavigateToResource />} />

                    <Route path="/dashboard/courses">
                      <Route index element={<CourseList />} />
                      <Route
                        path="create"
                        element={<CourseCreate />}
                      />
                      <Route
                        path="edit/:id"
                        element={<CourseEdit />}
                      />
                      <Route
                        path="show/:id"
                        element={<CourseShow />}
                      />
                    </Route>

                    <Route path="/dashboard/users">
                      <Route index element={<UserList />} />
                      <Route
                        path="create"
                        element={<UserCreate />}
                      />
                      <Route
                        path="edit/:id"
                        element={<UserEdit />}
                      />
                      <Route
                        path="show/:id"
                        element={<UserShow />}
                      />
                    </Route>

                  </Route>

                  <Route
                    element={
                      <Authenticated fallback={<Outlet />}>
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<LoginPage />} />
                  </Route>

                  <Route
                    element={
                      <Authenticated>
                        <NavigateToResource />
                      </Authenticated>
                    }>
                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                </Routes>
                <RefineKbar />
                <UnsavedChangesNotifier />
              </Refine>
          </ShoppingCartProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
