# import os
# import re
# import asyncio
# import logging
# import subprocess
# import requests
# from aiogram import Bot, Dispatcher, types
# from aiogram.types import FSInputFile
# from aiogram.enums import ParseMode
# from aiogram.utils.markdown import hbold
# from datetime import datetime

# TOKEN = "BOT_TOKEN_BUYERDA"

# logging.basicConfig(level=logging.INFO)
# bot = Bot(token=TOKEN)
# dp = Dispatcher()

# # Video yuklash funksiyasi
# async def download_video(m3u8_url, output_path):
#     cmd = [
#         "ffmpeg", "-i", m3u8_url,
#         "-c", "copy",
#         "-bsf:a", "aac_adtstoasc",
#         output_path
#     ]
#     return subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# # M3U8 linkni ajratish
# def extract_m3u8(url):
#     headers = {"User-Agent": "Mozilla/5.0"}
#     r = requests.get(url, headers=headers)
#     if r.status_code == 200:
#         match = re.search(r'"src"\s*:\s*"([^"]+\.m3u8.*?)"', r.text)
#         if match:
#             return match.group(1).replace('\\u0026', '&')
#     return None

# @dp.message()
# async def handle_msg(message: types.Message):
#     url = message.text.strip()
#     if "kinescope.io/embed/" not in url:
#         await message.answer("🧐 Bu qanday link? Kinescope link bering, balki tangamiz tushar...")
#         return

#     await message.answer("🍵 Video tayyorlanmoqda... Choynak g‘uvillayapti... 🔥")
#     await asyncio.sleep(1)

#     m3u8_url = extract_m3u8(url)
#     if not m3u8_url:
#         await message.answer("❌ M3U8 topilmadi. Ehtimol video yopiq yoki token eskirgan 😒")
#         return

#     # Fayl nomini vaqtga qarab yaratish
#     timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
#     filename = f"video_{timestamp}.mp4"

#     await message.answer(f"🎯 Topdim!\n{hbold('Yuklab olayapman...')}\nBu orada choy damlab turing ☕")
#     await asyncio.sleep(1)

#     result = await download_video(m3u8_url, filename)

#     if result.returncode != 0 or not os.path.exists(filename):
#         await message.answer("💣 FFmpeg portlab ketdi shekilli. Video chiqmadi 😓")
#         return

#     # Faylni serverga joylashtiramiz va URL qaytaramiz
#     video_url = f"http://15.188.144.28:8000/{filename}"
#     await message.answer(f"Tayyor! Mana video linki: {video_url}")
    
#     # Faylni o'chirish
#     os.remove(filename)

# # Botni ishga tushurish
# async def main():
#     await dp.start_polling(bot)

# if __name__ == "__main__":
#     asyncio.run(main())






# import os
# import re
# import asyncio
# import logging
# import subprocess
# import requests
# from aiogram import Bot, Dispatcher, types
# from aiogram.types import FSInputFile
# from aiogram.enums import ParseMode
# from aiogram.utils.markdown import hbold

# TOKEN = "7897153787:AAEqWoQCiP7z-koNuK7QOSIqNh7caZAXV_w"

# logging.basicConfig(level=logging.INFO)
# bot = Bot(token=TOKEN)
# dp = Dispatcher()

# # Video yuklash funksiyasi
# async def download_video(m3u8_url, output_path):
#     cmd = [
#         "ffmpeg", "-i", m3u8_url,
#         "-c", "copy",
#         "-bsf:a", "aac_adtstoasc",
#         output_path
#     ]
#     return subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# # M3U8 linkni ajratish
# def extract_m3u8(url):
#     headers = {"User-Agent": "Mozilla/5.0"}
#     r = requests.get(url, headers=headers)
#     if r.status_code == 200:
#         match = re.search(r'"src"\s*:\s*"([^"]+\.m3u8.*?)"', r.text)
#         if match:
#             return match.group(1).replace('\\u0026', '&')
#     return None

# @dp.message()
# async def handle_msg(message: types.Message):
#     url = message.text.strip()
#     if "kinescope.io/embed/" not in url:
#         await message.answer("Bu qanday link? Kinescope link bering, balki tangamiz tushar...")
#         return

#     await message.answer("Video tayyorlanmoqda... Choynak guvillayapti...")
#     await asyncio.sleep(1)

#     m3u8_url = extract_m3u8(url)
#     if not m3u8_url:
#         await message.answer("M3U8 topilmadi. Ehtimol video yopiq yoki token eskirgan")
#         return

#     filename = f"video_1.mp4"
#     await message.answer(f"Topdim!\n{hbold('Yuklab olayapman...')}\nBu orada choy damlab turing")
#     await asyncio.sleep(1)

#     result = await download_video(m3u8_url, filename)

#     if result.returncode != 0 or not os.path.exists(filename):
#         await message.answer("FFmpeg portlab ketdi shekilli. Video chiqmadi")
#         return

#     await message.answer("Tayyor! Mana ko‘r, shuncha xafagarchiliklarimiz ketdi")
#     await message.reply_document(FSInputFile(filename))
#     os.remove(filename)

# # Botni ishga tushurish
# async def main():
#     await dp.start_polling(bot)

# if __name__ == "__main__":
#     asyncio.run(main())



#     //

# import os
# import re
# import asyncio
# import logging
# import subprocess
# import requests
# from aiogram import Bot, Dispatcher, types
# from aiogram.types import FSInputFile
# from aiogram.enums import ParseMode
# from aiogram.utils.markdown import hbold
# from datetime import datetime

# TOKEN = "7897153787:AAEqWoQCiP7z-koNuK7QOSIqNh7caZAXV_w"

# logging.basicConfig(level=logging.INFO)
# bot = Bot(token=TOKEN)
# dp = Dispatcher()

# # Video yuklash funksiyasi
# async def download_video(m3u8_url, output_path):
#     cmd = [
#         "ffmpeg", "-i", m3u8_url,
#         "-c", "copy",
#         "-bsf:a", "aac_adtstoasc",
#         output_path
#     ]
#     return subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# # M3U8 linkni ajratish
# def extract_m3u8(url):
#     headers = {"User-Agent": "Mozilla/5.0"}
#     r = requests.get(url, headers=headers)
#     if r.status_code == 200:
#         match = re.search(r'"src"\s*:\s*"([^"]+\.m3u8.*?)"', r.text)
#         if match:
#             return match.group(1).replace('\\u0026', '&')
#     return None

# @dp.message()
# async def handle_msg(message: types.Message):
#     url = message.text.strip()
#     if "kinescope.io/embed/" not in url:
#         await message.answer("Bu qanday link? Kinescope link bering, balki tangamiz tushar...")
#         return

#     await message.answer("Video tayyorlanmoqda... Choynak guvillayapti...")
#     await asyncio.sleep(1)

#     m3u8_url = extract_m3u8(url)
#     if not m3u8_url:
#         await message.answer("M3U8 topilmadi. Ehtimol video yopiq yoki token eskirgan")
#         return

#     # Sana va vaqtni olish
#     current_time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
#     filename = f"video_{current_time}.mp4"
#     await message.answer(f"Topdim!\n{hbold('Yuklab olayapman...')}\nBu orada choy damlab turing")
#     await asyncio.sleep(1)

#     result = await download_video(m3u8_url, filename)

#     if result.returncode != 0 or not os.path.exists(filename):
#         await message.answer("FFmpeg portlab ketdi shekilli. Video chiqmadi")
#         return

#     # Faqat video nomini yuborish
#     await message.answer(f"http://15.188.144.28:8000/{filename}")

# # Botni ishga tushurish
# async def main():
#     await dp.start_polling(bot)

# if __name__ == "__main__":
#     asyncio.run(main())


# http://15.188.144.28:8000/video_1.mp4 


# import os
# import re
# import asyncio
# import logging
# import subprocess
# import requests
# from aiogram import Bot, Dispatcher, types
# from aiogram.types import FSInputFile
# from aiogram.utils.markdown import hbold
# from datetime import datetime

# TOKEN = ""

# logging.basicConfig(level=logging.INFO)
# bot = Bot(token=TOKEN)
# dp = Dispatcher()

# async def download_video(m3u8_url, output_path):
#     cmd = [
#         "ffmpeg", "-i", m3u8_url,
#         "-c", "copy",
#         "-bsf:a", "aac_adtstoasc",
#         output_path
#     ]
#     return subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# def extract_m3u8(url):
#     headers = {"User-Agent": "Mozilla/5.0"}
#     r = requests.get(url, headers=headers)
#     if r.status_code == 200:
#         match = re.search(r'"src"\s*:\s*"([^"]+\.m3u8.*?)"', r.text)
#         if match:
#             return match.group(1).replace('\\u0026', '&')
#     return None

# @dp.message()
# async def handle_msg(message: types.Message):
#     url = message.text.strip()
#     if "kinescope.io/embed/" not in url:
#         await message.answer("Bu qanday link? Kinescope link bering, ")
#         return

#     await message.answer("Video tayyorlanmoqda...")
#     await asyncio.sleep(1)

#     m3u8_url = extract_m3u8(url)
#     if not m3u8_url:
#         await message.answer("M3U8 topilmadi. Ehtimol video yopiq yoki token eskirgan")
#         return

#     current_time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
#     filename = f"video_{current_time}.mp4"
#     await message.answer(f"Topdim! Yuklab olayapman...")
#     await asyncio.sleep(1)

#     result = await download_video(m3u8_url, filename)

#     if result.returncode != 0 or not os.path.exists(filename):
#         await message.answer("FFmpeg portlab ketdi shekilli. Video chiqmadi")
#         return

#     await message.answer(f"Video tayyor! Mana yuklab olish uchun link: http://15.188.144.28:8000/{filename}")
#     # python3 -m http.server 8000  8000 portga ruxsat berish kerak

# async def main():
#     await dp.start_polling(bot)

# if __name__ == "__main__":
#     asyncio.run(main())
