"use client";
import { Menu, MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function DashboardSideMenu() {
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState([""]);

  useEffect(() => {
    if (pathname.startsWith("/statistics")) {
      setSelectedKey(["2"]);
    } else if (pathname.startsWith("/categories")) {
      setSelectedKey(["3"]);
    } else if (pathname.startsWith("/products")) {
      setSelectedKey(["4"]);
    } else if (pathname.startsWith("/promotions")) {
      setSelectedKey(["5"]);
    } else if (pathname.startsWith("/orders")) {
      setSelectedKey(["6"]);
    } else if (pathname.startsWith("/users")) {
      setSelectedKey(["7"]);
    } else if (pathname.startsWith("/reviews")) {
      setSelectedKey(["8"]);
    } else if (pathname.startsWith("/configurations")) {
      setSelectedKey(["9"]);
    } else if (pathname.startsWith("/product-item")) {
      setSelectedKey(["10"]);
    } else if (pathname === "/dashboard") {
      setSelectedKey(["1"]);
    }
  }, [pathname]);

  const menuItems: MenuProps["items"] = [
    { label: <Link href="/dashboard">Home</Link>, key: "1" },
    { label: <Link href="/dashboard/statistics">Thống kê</Link>, key: "2" },
    { type: "divider" },
    {
      label: <Link href="/dashboard/categories">Danh mục sản phẩm</Link>,
      key: "3",
    },
    { label: <Link href="/dashboard/products">Sản phẩm</Link>, key: "4" },
    { label: <Link href="/dashboard/promotions">Khuyến mãi</Link>, key: "5" },
    { label: <Link href="/dashboard/orders">Đơn hàng</Link>, key: "6" },
    { type: "divider" },
    { label: <Link href="/dashboard/users">Khách hàng</Link>, key: "7" },
    { label: <Link href="/dashboard/reviews">Đánh giá</Link>, key: "8" },
    { label: <Link href="/dashboard/configurations">Cấu hình</Link>, key: "9" },
    {
      label: <Link href="/dashboard/product-item">Chi tiết sản phẩm</Link>,
      key: "10",
    },
  ];

  return (
    <Menu mode="inline" items={menuItems} selectedKeys={selectedKey}></Menu>
  );
}
