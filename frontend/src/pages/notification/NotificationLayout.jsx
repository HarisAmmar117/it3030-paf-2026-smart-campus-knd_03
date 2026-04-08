import { Outlet } from "react-router-dom";

export default function NotificationLayout() {
    return (
        <div className="page-container">
            <Outlet />
        </div>
    );
}