## new project: reading annotations generator for chinese, japanese & korean song lyrics

docker compose structure with python

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

docker compose structure without python

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
