#!/bin/bash
cd "$(dirname "$0")"
echo "=================================================="
echo "   ĐANG KHỞI ĐỘNG HERITSTYLE - VIỆT PHỤC REMIX"
echo "=================================================="
echo "Vui lòng giữ cửa sổ này mở trong khi sử dụng web."
echo "Để tắt, chỉ cần đóng cửa sổ này lại."
echo ""
open "http://localhost:3000"
npm run dev
