import * as React from "react";
import { memo } from "react";

const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={"auto"}
    height="3.75em"
    viewBox="0 0 3869 1728"
    fill="currentColor"
  >
    <path d="M1405 216H324.999c-59.647 0-108 48.353-108 108v133.56c140.453 45.73 286.089 115.007 442.461 217.274C738.188 591.797 849.541 540 972.999 540 1211.59 540 1405 733.413 1405 972c0 238.59-193.41 432-432.001 432-238.587 0-432-193.41-432-432 0-76.163 19.735-147.707 54.333-209.84-90.322-58.807-178.545-107.272-265.265-145.814-37.898-16.844-75.447-31.893-113.068-45.26V1404c0 59.65 48.353 108 108 108H1405c59.65 0 108-48.35 108-108V324c0-59.647-48.35-108-108-108Z" />
    <path d="M958.496 1044H756.999v108H1153V756h-108v220.434c-136.686-123.266-264.335-222.331-385.54-301.6a433.37 433.37 0 0 0-64.128 87.326C712.424 838.396 833.043 932.018 958.496 1044ZM1880.31 1041.33c-28.75 0-52.65-7.27-71.71-21.8-19.06-14.54-30.2-34.24-33.43-59.115h41.67c2.58 12.598 9.28 23.499 20.1 32.704 10.82 9.201 25.44 13.811 43.85 13.811 17.12 0 29.72-3.64 37.79-10.904 8.07-7.266 12.11-15.904 12.11-25.92 0-14.536-5.25-24.227-15.74-29.072-10.5-4.846-25.28-9.205-44.33-13.081-12.92-2.581-25.85-6.297-38.76-11.142-12.92-4.846-23.74-11.706-32.46-20.592-8.72-8.879-13.09-20.592-13.09-35.128 0-20.991 7.83-38.193 23.5-51.599 15.66-13.398 36.9-20.105 63.71-20.105 25.52 0 46.43 6.381 62.75 19.136 16.3 12.763 25.75 30.934 28.34 54.506h-40.21c-1.62-12.269-6.87-21.879-15.75-28.827-8.89-6.941-20.76-10.415-35.61-10.415-14.53 0-25.76 3.072-33.67 9.204-7.92 6.14-11.87 14.219-11.87 24.223 0 9.691 5.08 17.287 15.26 22.772 10.17 5.496 23.98 10.177 41.43 14.053 14.85 3.233 28.98 7.19 42.39 11.871 13.4 4.684 24.38 11.629 32.94 20.833 8.56 9.204 12.84 22.53 12.84 39.969.32 21.646-7.83 39.488-24.46 53.538-16.64 14.05-39.17 21.08-67.59 21.08ZM2114.81 1035.51c-21.97 0-39.24-5.32-51.84-15.98-12.59-10.66-18.89-29.878-18.89-57.663V829.598h-41.68v-34.397h41.68l5.32-57.658h35.37v57.658h70.74v34.397h-70.74v132.269c0 15.188 3.07 25.437 9.21 30.769 6.13 5.328 16.95 7.994 32.46 7.994h25.19v34.88h-36.82ZM2287.29 1041.33c-20.03 0-36.66-3.4-49.9-10.18-13.25-6.78-23.09-15.82-29.55-27.13-6.47-11.303-9.69-23.572-9.69-36.821 0-24.545 9.36-43.44 28.1-56.689 18.73-13.238 44.24-19.864 76.55-19.864h64.92v-2.908c0-20.99-5.49-36.897-16.47-47.722-10.98-10.817-25.68-16.229-44.09-16.229-15.83 0-29.48 3.957-40.94 11.87-11.47 7.918-18.65 19.462-21.56 34.642h-41.67c1.61-17.443 7.51-32.137 17.69-44.091 10.17-11.947 22.84-21.075 38.03-27.376 15.18-6.297 31.33-9.445 48.45-9.445 33.59 0 58.87 8.963 75.82 26.889 16.96 17.926 25.44 41.75 25.44 71.462v147.772h-36.34l-2.42-43.119c-6.78 13.569-16.71 25.119-29.8 34.639-13.07 9.53-30.6 14.3-52.57 14.3Zm6.3-34.4c15.51 0 28.83-4.04 39.97-12.114 11.15-8.071 19.63-18.57 25.44-31.493 5.82-12.916 8.72-26.483 8.72-40.698v-.486h-61.53c-23.91 0-40.78 4.117-50.63 12.356-9.86 8.236-14.78 18.493-14.78 30.766 0 12.598 4.61 22.694 13.81 30.282 9.21 7.597 22.21 11.387 39 11.387ZM2557.65 1035.51c-21.97 0-39.25-5.32-51.85-15.98-12.6-10.66-18.89-29.878-18.89-57.663V829.598h-41.67v-34.397h41.67l5.33-57.658h35.36v57.658h70.74v34.397h-70.74v132.269c0 15.188 3.07 25.437 9.21 30.769 6.14 5.328 16.96 7.994 32.46 7.994h25.2v34.88h-36.82ZM2751.44 1041.33c-22.94 0-43.29-5.26-61.04-15.75-17.77-10.49-31.74-25.11-41.91-43.845-10.18-18.73-15.26-40.858-15.26-66.38 0-25.192 5-47.239 15.02-66.134 10-18.895 23.98-33.589 41.9-44.088 17.93-10.495 38.68-15.746 62.26-15.746 23.26 0 43.37 5.251 60.32 15.746 16.96 10.499 29.96 24.308 39.01 41.426 9.04 17.121 13.57 35.534 13.57 55.233 0 3.555-.09 7.105-.25 10.656-.17 3.559-.24 7.596-.24 12.115h-191.38c.97 18.409 5.24 33.673 12.84 45.785 7.58 12.111 17.12 21.243 28.58 27.375 11.47 6.137 23.66 9.207 36.58 9.207 16.8 0 30.85-3.88 42.15-11.632 11.31-7.752 19.55-18.243 24.72-31.493h40.21c-6.47 22.289-18.82 40.785-37.06 55.475-18.26 14.7-41.6 22.05-70.02 22.05Zm0-217.543c-19.38 0-36.57 5.895-51.6 17.681-15.01 11.798-23.66 28.996-25.91 51.602h151.16c-.97-21.637-8.41-38.594-22.29-50.874-13.89-12.273-31.01-18.409-51.36-18.409ZM1788.25 1506.19v-240.32h36.82l2.91 34.89c7.75-12.92 18.08-22.94 31.01-30.04 12.91-7.1 27.45-10.66 43.6-10.66 19.06 0 35.45 3.88 49.18 11.63 13.72 7.75 24.3 19.54 31.73 35.36 8.4-14.53 19.94-25.99 34.65-34.4 14.69-8.39 30.6-12.59 47.72-12.59 28.74 0 51.67 8.64 68.8 25.92 17.12 17.28 25.68 43.85 25.68 79.7v140.51h-40.22v-136.15c0-24.87-5.01-43.6-15.01-56.2-10.02-12.6-24.4-18.9-43.12-18.9-19.39 0-35.46 7.51-48.21 22.53-12.77 15.02-19.14 36.42-19.14 64.2v124.52h-40.7v-136.15c0-24.87-5.01-43.6-15.02-56.2-10.02-12.6-24.39-18.9-43.12-18.9-19.07 0-34.97 7.51-47.72 22.53-12.77 15.02-19.14 36.42-19.14 64.2v124.52h-40.7ZM2301.82 1512c-20.03 0-36.66-3.39-49.9-10.17-13.25-6.79-23.1-15.83-29.56-27.14-6.46-11.3-9.69-23.57-9.69-36.82 0-24.54 9.37-43.44 28.1-56.69 18.73-13.24 44.25-19.86 76.55-19.86h64.93v-2.91c0-20.99-5.5-36.9-16.48-47.72s-25.68-16.23-44.08-16.23c-15.84 0-29.48 3.96-40.95 11.87-11.47 7.92-18.65 19.46-21.56 34.64h-41.66c1.61-17.44 7.5-32.14 17.68-44.09 10.17-11.95 22.85-21.07 38.03-27.38 15.18-6.29 31.33-9.44 48.46-9.44 33.58 0 58.86 8.96 75.82 26.89 16.95 17.92 25.43 41.75 25.43 71.46v147.78h-36.33l-2.43-43.13c-6.78 13.57-16.71 25.12-29.79 34.64-13.09 9.53-30.61 14.3-52.57 14.3Zm6.3-34.4c15.5 0 28.83-4.03 39.97-12.11 11.14-8.07 19.62-18.57 25.44-31.5 5.81-12.91 8.72-26.48 8.72-40.69v-.49h-61.54c-23.9 0-40.77 4.12-50.63 12.36-9.85 8.23-14.77 18.49-14.77 30.76 0 12.6 4.6 22.7 13.8 30.29 9.21 7.59 22.21 11.38 39.01 11.38ZM2594.45 1512c-22.94 0-43.53-5.26-61.77-15.75-18.26-10.49-32.63-25.19-43.13-44.09-10.5-18.89-15.74-40.94-15.74-66.13 0-25.19 5.24-47.24 15.74-66.14 10.5-18.89 24.87-33.59 43.13-44.08 18.24-10.5 38.83-15.75 61.77-15.75 28.42 0 52.4 7.43 71.95 22.28 19.54 14.87 31.89 34.73 37.06 59.6h-41.66c-3.24-14.85-11.15-26.41-23.74-34.64-12.6-8.24-27.3-12.36-44.09-12.36-13.57 0-26.33 3.4-38.28 10.18-11.95 6.78-21.64 16.96-29.07 30.52-7.43 13.57-11.14 30.37-11.14 50.39 0 20.03 3.71 36.82 11.14 50.39 7.43 13.56 17.12 23.82 29.07 30.77 11.95 6.94 24.71 10.41 38.28 10.41 16.79 0 31.49-4.12 44.09-12.35 12.59-8.24 20.5-19.94 23.74-35.13h41.66c-4.84 24.22-17.12 43.93-36.82 59.11-19.71 15.19-43.77 22.77-72.19 22.77ZM2760.15 1506.19v-348.85h40.7v149.71c8.06-14.85 19.53-26.4 34.39-34.64 14.86-8.23 31.02-12.35 48.46-12.35 27.77 0 50.06 8.64 66.86 25.92 16.79 17.28 25.19 43.85 25.19 79.7v140.51h-40.21v-136.15c0-50.06-20.2-75.1-60.57-75.1-21 0-38.6 7.51-52.81 22.53-14.21 15.02-21.31 36.42-21.31 64.2v124.52h-40.7ZM3061.99 1212.58c-8.08 0-14.78-2.67-20.1-8-5.34-5.33-8-12.03-8-20.1 0-7.76 2.66-14.22 8-19.38 5.32-5.17 12.02-7.76 20.1-7.76 7.75 0 14.37 2.59 19.87 7.76 5.49 5.16 8.23 11.62 8.23 19.38 0 8.07-2.74 14.77-8.23 20.1-5.5 5.33-12.12 8-19.87 8Zm-20.35 293.61v-240.32h40.7v240.32h-40.7ZM3153.08 1506.19v-240.32h36.82l2.42 43.12c7.75-15.17 18.9-27.13 33.43-35.85 14.54-8.72 31.01-13.08 49.42-13.08 28.42 0 51.11 8.64 68.07 25.92 16.96 17.28 25.44 43.85 25.44 79.7v140.51h-40.7v-136.15c0-50.06-20.67-75.1-62.02-75.1-20.67 0-37.87 7.51-51.59 22.53-13.74 15.02-20.6 36.42-20.6 64.2v124.52h-40.69ZM3538.25 1512c-22.93 0-43.28-5.26-61.04-15.75-17.77-10.49-31.74-25.11-41.91-43.84-10.18-18.73-15.26-40.86-15.26-66.38 0-25.19 5-47.24 15.02-66.14 10.01-18.89 23.98-33.59 41.9-44.08 17.93-10.5 38.68-15.75 62.26-15.75 23.26 0 43.37 5.25 60.32 15.75 16.96 10.49 29.96 24.3 39.01 41.42 9.04 17.12 13.56 35.54 13.56 55.23 0 3.56-.08 7.11-.24 10.66-.17 3.56-.24 7.6-.24 12.12h-191.38c.97 18.4 5.25 33.67 12.84 45.78s17.12 21.24 28.58 27.38c11.47 6.14 23.66 9.2 36.58 9.2 16.8 0 30.85-3.88 42.16-11.63 11.3-7.75 19.53-18.24 24.71-31.49h40.21c-6.47 22.29-18.82 40.78-37.07 55.48-18.25 14.7-41.59 22.04-70.01 22.04Zm0-217.54c-19.37 0-36.58 5.89-51.6 17.68-15.01 11.8-23.66 29-25.92 51.6h151.17c-.97-21.63-8.4-38.59-22.29-50.87-13.89-12.27-31.01-18.41-51.36-18.41ZM1801.34 564.841V358.925H1765v-34.396h36.34v-41.67c0-23.254 5.81-40.211 17.44-50.871 11.63-10.66 28.58-15.988 50.87-15.988h24.23v34.883h-17.93c-12.28 0-21 2.505-26.17 7.511-5.16 5.01-7.75 13.491-7.75 25.434v40.701h59.11v34.396h-59.11v205.916h-40.69Zm148.25 0V216h40.7v348.841h-40.7ZM2166.65 570.655c-22.62 0-42.97-5.171-61.05-15.505-18.09-10.334-32.39-24.951-42.88-43.846-10.5-18.895-15.74-41.099-15.74-66.621 0-25.51 5.32-47.722 15.98-66.617 10.66-18.895 25.11-33.508 43.36-43.85 18.25-10.331 38.68-15.502 61.3-15.502 22.6 0 42.95 5.171 61.04 15.502 18.09 10.342 32.38 24.955 42.88 43.85 10.5 18.895 15.75 41.107 15.75 66.617 0 25.522-5.33 47.726-15.99 66.621-10.66 18.895-25.12 33.512-43.36 43.846-18.26 10.334-38.69 15.505-61.29 15.505Zm0-34.883c13.88 0 26.8-3.393 38.76-10.177 11.94-6.783 21.63-16.957 29.07-30.524 7.42-13.563 11.14-30.355 11.14-50.388 0-20.021-3.63-36.821-10.9-50.388-7.27-13.563-16.88-23.741-28.83-30.524-11.95-6.78-24.71-10.174-38.27-10.174-13.9 0-26.82 3.394-38.77 10.174-11.95 6.783-21.64 16.961-29.07 30.524-7.43 13.567-11.14 30.367-11.14 50.388 0 20.033 3.71 36.825 11.14 50.388 7.43 13.567 17.04 23.741 28.83 30.524 11.79 6.784 24.47 10.177 38.04 10.177ZM2343.98 564.841V324.529h36.82l3.39 46.025c7.43-15.819 18.73-28.417 33.91-37.79 15.18-9.365 33.92-14.05 56.21-14.05v42.636h-11.15c-14.21 0-27.29 2.505-39.24 7.511-11.96 5.01-21.49 13.487-28.59 25.434-7.11 11.954-10.66 28.429-10.66 49.419v121.127h-40.69ZM2618.69 570.655c-22.95 0-43.29-5.255-61.05-15.746-17.77-10.492-31.74-25.112-41.91-43.846-10.18-18.731-15.26-40.858-15.26-66.38 0-25.192 5-47.24 15.02-66.135 10-18.895 23.98-33.588 41.9-44.087 17.93-10.495 38.68-15.747 62.26-15.747 23.26 0 43.37 5.252 60.32 15.747 16.96 10.499 29.96 24.307 39.01 41.425 9.03 17.122 13.56 35.534 13.56 55.234 0 3.554-.08 7.105-.24 10.656-.17 3.558-.24 7.595-.24 12.115h-191.38c.97 18.409 5.25 33.673 12.84 45.784 7.58 12.112 17.12 21.243 28.58 27.376 11.47 6.14 23.66 9.204 36.59 9.204 16.79 0 30.83-3.876 42.15-11.629 11.3-7.753 19.53-18.244 24.71-31.493h40.21c-6.47 22.289-18.82 40.782-37.07 55.479-18.25 14.7-41.59 22.043-70 22.043Zm0-217.54c-19.38 0-36.59 5.895-51.61 17.681-15.01 11.797-23.66 28.995-25.92 51.602h151.17c-.97-21.638-8.4-38.595-22.29-50.875-13.89-12.272-31.01-18.408-51.35-18.408ZM2786.31 564.841V324.529h36.82l2.43 43.118c7.75-15.176 18.89-27.13 33.42-35.852 14.54-8.722 31.01-13.081 49.43-13.081 28.41 0 51.11 8.646 68.07 25.92 16.96 17.283 25.43 43.846 25.43 79.702v140.505h-40.69V428.695c0-50.062-20.68-75.098-62.02-75.098-20.67 0-37.88 7.512-51.6 22.53-13.73 15.019-20.59 36.419-20.59 64.197v124.517h-40.7ZM3173.91 570.655c-22.94 0-43.53-5.255-61.77-15.746-18.25-10.492-32.63-25.196-43.13-44.091-10.49-18.895-15.74-40.939-15.74-66.135 0-25.192 5.25-47.24 15.74-66.135 10.5-18.895 24.88-33.588 43.13-44.087 18.24-10.495 38.83-15.747 61.77-15.747 28.42 0 52.4 7.435 71.95 22.285 19.54 14.862 31.89 34.726 37.06 59.597h-41.66c-3.24-14.854-11.14-26.407-23.74-34.642-12.6-8.239-27.3-12.357-44.09-12.357-13.57 0-26.33 3.394-38.28 10.174-11.95 6.783-21.64 16.961-29.07 30.524-7.43 13.567-11.14 30.367-11.14 50.388 0 20.033 3.71 36.825 11.14 50.388 7.43 13.567 17.12 23.825 29.07 30.769 11.95 6.948 24.71 10.415 38.28 10.415 16.79 0 31.49-4.118 44.09-12.353 12.6-8.239 20.5-19.941 23.74-35.128h41.66c-4.84 24.223-17.12 43.93-36.82 59.11-19.7 15.187-43.77 22.771-72.19 22.771ZM3447.65 570.655c-22.93 0-43.28-5.255-61.05-15.746-17.76-10.492-31.73-25.112-41.9-43.846-10.18-18.731-15.26-40.858-15.26-66.38 0-25.192 5-47.24 15.01-66.135 10.01-18.895 23.99-33.588 41.91-44.087 17.93-10.495 38.68-15.747 62.26-15.747 23.26 0 43.36 5.252 60.32 15.747 16.96 10.499 29.96 24.307 39.01 41.425 9.04 17.122 13.56 35.534 13.56 55.234 0 3.554-.08 7.105-.24 10.656-.17 3.558-.24 7.595-.24 12.115h-191.38c.97 18.409 5.24 33.673 12.84 45.784 7.58 12.112 17.11 21.243 28.58 27.376 11.47 6.14 23.66 9.204 36.58 9.204 16.79 0 30.84-3.876 42.15-11.629 11.31-7.753 19.54-18.244 24.71-31.493h40.22c-6.47 22.289-18.82 40.782-37.07 55.479-18.25 14.7-41.59 22.043-70.01 22.043Zm0-217.54c-19.38 0-36.58 5.895-51.6 17.681-15.02 11.797-23.66 28.995-25.92 51.602h151.17c-.97-21.638-8.41-38.595-22.29-50.875-13.89-12.272-31.01-18.408-51.36-18.408Z" />
  </svg>
);
const Memo = memo(Logo);
export default Memo;