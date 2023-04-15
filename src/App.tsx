import { GitHubBanner, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  notificationProvider, ErrorComponent,
  ThemedLayout
} from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import routerBindings, {
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { NavigateToResource } from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import { AntdInferencer } from '@refinedev/inferencer/antd';
import { ColorModeContextProvider } from "./contexts/color-mode";

import BlogPostList from "./blog-posts"
import BlogPostCreate from "./blog-posts/create/index"
import BlogPostShow from "./blog-posts/show/[id]"
import BlogPostEdit from "./blog-posts/edit/[id]"

import CategoryList from "./categories/index"
import CategoryShow from "./categories/show/[id]"

import UserList from "./users/index"
import UserCreate from "./users/create"
import UserShow from "./users/show"
import UserEdit from "./users/edit"

import CourseList from "./courses/index"
import CourseCreate from "./courses/create"
import CourseShow from "./courses/show"
import CourseEdit from "./courses/edit"

import { InferField } from "@refinedev/inferencer/antd";

// dataProvider={dataProvider("https://api.fake-rest.refine.dev")}
  //   if (field.key === "size") {
  //     return false;
  //   }
  //     return field;
  //  }

function App() {

  const coursesTransformer = (field: InferField) => {
    console.log(field.key);
    return field;
  }

  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <Refine
            notificationProvider={notificationProvider}
            routerProvider={routerBindings}
            dataProvider={{
              default: dataProvider("http://127.0.0.1:3001"),
              dummy: dataProvider("https://api.fake-rest.refine.dev"),

            }}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
            }}
            resources={[
              {
                name: 'courses',
                list: '/courses',
                show: '/courses/show/:id',
                create: '/courses/create',
                edit: '/courses/edit/:id',
                meta: {
                  canDelete: true,
                  dataProviderName: "default",
                },
              },
              {
                name: 'users',
                list: '/users',
                show: '/users/show/:id',
                create: '/users/create',
                edit: '/users/edit/:id',
                meta: {
                  canDelete: true,
                  dataProviderName: "default",
                },
              },
              {
                name: 'blog_posts',
                list: '/blog-posts',
                show: '/blog-posts/show/:id',
                create: '/blog-posts/create',
                edit: '/blog-posts/edit/:id',
                meta: {
                  canDelete: true,
                  dataProviderName: "dummy",
                },
              },
              {
                name: 'categories',
                list: '/categories',
                show: '/categories/show/:id',
                meta: {
                  dataProviderName: "dummy",
                },
              },
            ]}
          >
            <Routes>
              <Route
                element={
                  <ThemedLayout>
                    <Outlet />
                  </ThemedLayout>
                }
              >
                <Route index element={<NavigateToResource />} />

                <Route path="courses">
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

                <Route path="users">
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

                <Route path="blog-posts">
                  <Route index element={<BlogPostList />} />
                  <Route
                    path="show/:id"
                    element={<BlogPostShow />}
                  />
                  <Route path="create" element={<BlogPostCreate />} />
                  <Route
                    path="edit/:id"
                    element={<BlogPostEdit />}
                  />
                </Route>
                <Route path="categories">
                  <Route index element={<CategoryList />} />
                  <Route
                    path="show/:id"
                    element={<CategoryShow />}
                  />
                </Route>
                <Route path="*" element={<ErrorComponent />} />
              </Route>
            </Routes>
            <RefineKbar />
            <UnsavedChangesNotifier />
          </Refine>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;









