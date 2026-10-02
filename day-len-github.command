#!/bin/bash
cd "$(dirname "$0")"
echo "=================================================="
echo "   ĐANG ĐẨY MÃ NGUỒN LÊN GITHUB CỦA BẠN"
echo "=================================================="
echo ""
git add .
git commit -m "feat: nâng cấp trực quan y phục hoàng gia, 4 bối cảnh di sản & xuất poster" || true
git push -u origin main
echo ""
echo "=================================================="
echo "   ĐÃ ĐẨY LÊN GITHUB & VERCEL TỰ ĐỘNG CẬP NHẬT!"
echo "=================================================="
read -p "Nhấn Enter để thoát..."
