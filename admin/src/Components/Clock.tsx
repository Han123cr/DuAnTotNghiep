import React, { useEffect, useRef } from "react";

const Clock: React.FC = () => {
    const clockRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function time() {
            const today = new Date();
            const weekday = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
            const day = weekday[today.getDay()];

            const dd = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
            const mm = today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
            const yyyy = today.getFullYear();

            const h = today.getHours();
            const m = checkTime(today.getMinutes());
            const s = checkTime(today.getSeconds());

            const nowTime = `${h} giờ ${m} phút ${s} giây`;

            const todayString = `${day}, ${dd}/${mm}/${yyyy}`;
            const tmp = `<span class="date">${todayString} - ${nowTime}</span>`;

            if (clockRef.current) {
                clockRef.current.innerHTML = tmp;
            }

            setTimeout(time, 1000);
        }

        function checkTime(i: number) {
            return i < 10 ? '0' + i : i;
        }

        time();
    }, []);

    return <div id="clock" ref={clockRef} />;
};

export default Clock;
