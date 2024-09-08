[in progress]

## new project: reading annotations generator for chinese, japanese & korean song lyrics

This project was initially supposed to be set up with docker containers for both a python and node backend because i needed to use packages from both. Due to severe problems with some legacy packages and typescript i had to change the whole structure several times and in the end it was not neccessary to use python at all anymore. Despite everything I learned how to use python in a container inside a virtual env (in vs code 👹) and communicate with the node backend via a shared volume to avoid having to use another server for easier deployment.

## features

- [✅] Generate pronunciation annotations in Latin characters for song lyrics in Chinese, Japanese or Korean. This way, you can easily read the lyrics while listening to the music without having to constantly switch back and forth between two texts.
- [✅] Create, preview and save annotated lyrics as PDF.
- [✅] Print annotated lyrics via the browser print function (can also be saved as PDF).
- [❌] Create a user account to save your favorite songtexts and access them every time you want.

Please ignore console logs I just wanted to check if deployment works.

## reading info for japanese kanji

Since finding the correct reading according to the context is a difficult matter and even with the best tool I could find there are still too many mistakes, I implemented a method to get alternative reading options for japanese kanji and expressions. It's not finally decided which dictionaries/apis I will use. Information about licenses and sources can be found here:

- [kanjiapi.dev](https://kanjiapi.dev/)
- [Jotoba](https://jotoba.de/about)
- [Jisho](https://jisho.org/about)

I will update the license of the project once it's finished.

### former docker compose structure with python

```
project-root/
│
├── backend/
│ ├── node/
│ │ └── shared/ # virtual folder in container volume
│ ├── python/
│ │ └── shared/ # virtual folder in container volume
│ └── shared/ # locally shared folder
├── frontend/
└── docker-compose.yml
```

### docker compose structure without python

```
project-root/
│
├── backend/
├── frontend/
└── docker-compose.yml
```

### sample text

[Verse_1]
将过去都掩埋
收藏我的期待
转身带走 no more
时间风干了伤害
启程的现在
放开执着 let go
伤痕的刺痛 fade it
所有扑朔迷离
静止不安的迷惘在心上
遗憾 leave me alone
摆脱沉重枷锁
I fall down, I rise up
清醒了 沉睡的

[Chorus]
가라앉아 in the night
끝이 없는 어둠 사이
네 생각 속에 잠겨 숨을 쉬어, survive
꿈이 되어 버린 나의
어느 작은 날의 time
보이지 않는 너를 기다리며 survive, survive

[Bridge]
誰も気がついていない
何かおかしい世界
それでも弱く叫んだ
"I'm right here, I'm right here"
遠く聞こえた howling
小さな "Save me"
重なるたび getting so faster
共鳴し合って証明したい
僕の心が叫ぶんだ 今

### todo

- check if input/output component is loaded before scrolling
