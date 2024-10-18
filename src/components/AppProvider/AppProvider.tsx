import { Helmet, HelmetProvider } from 'react-helmet-async';

import '@mantine/core/styles.css';

import '@mantine/carousel/styles.css';
import '@mantine/charts/styles.css';
import '@mantine/code-highlight/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/tiptap/styles.css';

import { createTheme, MantineProvider } from '@mantine/core';
import { createRouter, RouterProvider } from '@tanstack/react-router';

import '@/utils/appwrite';

// Import the generated route tree
import { routeTree } from '@/routeTree.gen';

// Create a new router instance
const router = createRouter({ routeTree, basepath: import.meta.env.VITE_TANSTACK_BASE_PATH || '/' });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const theme = createTheme({
  /** Put your mantine theme override here */
});

export function AppProvider() {
  return (
    <HelmetProvider>
      <MantineProvider theme={theme}>
        <Helmet title="Random Forms" />
        <RouterProvider router={router} />
      </MantineProvider>
    </HelmetProvider>
  );
}
