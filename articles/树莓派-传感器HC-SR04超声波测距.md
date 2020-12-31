# 树莓派 - 传感器 HC-SR04 超声波测距

## HC-SR04 介绍

<img style="width: 300px;" src="https://img2020.cnblogs.com/blog/1141466/202012/1141466-20201219192954631-1997935472.png" />

### 电器参数

|电器参数|HC-SR04超声波模块|
|-|-|
|工作电压|DC5V|
|工作电流|15mA|
|工作频率|40Hz|
|最远射程|4m|
|最近射程|2cm|
|测量角度|15度|
|输入触发信号|10us的TTL脉冲|
|输出回响信号|输出TTL电平信号，与射程成比例|
|规格尺寸|45*20*15mm|

### 引脚

VCC、trig（控制端）、echo（接收端）、GND

### 使用方法

一个控制口发一个10US以上的高电平,就可以在接收口等待高电平输出.一有输出就可以开定时器计时,当此口变为低电平时就可以读定时器的值,此时就为此次测距的时间,方可算出距离.如此不断的周期测,就可以达到你移动测量的值了。

<br />

## 程序

语言：python

引脚：

|引脚|BCM 编码|
|-|-|
|Vcc|5V|
|Trig|23|
|Echo|24|
|Gnd|GND|

[树莓派 40Pin 引脚对照表](https://shumeipai.nxez.com/raspberry-pi-pins-version-40)

```python
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)

GPIO_TRIG = 23
GPIO_ECHO = 24

GPIO.setup(GPIO_TRIG, GPIO.OUT)
GPIO.setup(GPIO_ECHO, GPIO.IN)

def distance():
    # 发送高电平信号到 Trig 引脚
    GPIO.output(GPIO_TRIG, True)

    # 持续 10 us 
    time.sleep(0.00001)
    GPIO.output(GPIO_TRIG, False)

    # 高电平持续时间就是超声波从发射到返回的时间
    while GPIO.input(GPIO_ECHO) == GPIO.LOW: pass
    start_time = time.time()
    while GPIO.input(GPIO_ECHO) == GPIO.HIGH: pass
    stop_time = time.time()

    # 计算距离 声波的速度为 34000cm/s。
    distance = ((stop_time - start_time) * 34000) / 2

    return distance

while True:
    dist = distance()
    print("距离： {:.2f} cm".format(dist))
    time.sleep(1)

```

<br />

[whosmeya.com](https://www.whosmeya.com/)
