import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import PrivateLayout from "./components/PrivateLayout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ListPage from "./pages/ListPage";
import { HOME, PATH, TITLE, EXTRA, ItemCard, DetailPage } from "./caso";
import type { Item } from "./caso";

export default function App() {
return (
  <BrowserRouter>
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateLayout />}>
      <Route path={HOME} element={<ListPage path={PATH} title={TITLE} render={(item: Item) => <ItemCard item={item} />} />} />
      <Route path={`${PATH}/:id`} element={<DetailPage />} />
    {EXTRA.map((v) => <Route key={v.path} path={v.path} element={v.element} />)}
    </Route>
      <Route path="*" element={<Navigate to={HOME} replace />} />
    </Routes>
    </BrowserRouter>
  );
}
