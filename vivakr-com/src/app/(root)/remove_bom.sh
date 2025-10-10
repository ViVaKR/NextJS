#!/usr/bin/env zsh

# 파일 경로를 인자로 받음
file_path=$1

# 파일의 시작 3바이트를 읽음
bom=$(head -c 3 "$file_path")

# UTF-8 BOM과 비교
if [ "$bom" = $'\xef\xbb\xbf' ]; then
    echo "BOM detected in $file_path. Removing BOM..."
    # BOM을 제외한 나머지 내용을 임시 파일에 저장
    tail -c +4 "$file_path" > "$file_path.tmp"
    # 임시 파일을 원본 파일로 이동
    mv "$file_path.tmp" "$file_path"
    echo "BOM removed."
else
    echo "No BOM detected in $file_path."
fi
