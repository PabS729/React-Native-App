import React, {Component} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import moment from 'moment';

const data = {
  timer: 12345,
  laps: [12345,1223],
}

function Timer({interval, style}) {
  const pad = (n) => n < 10 ? '0' + n : n
  const duration = moment.duration(interval)
  const centiseconds = Math.floor(duration.milliseconds()/10)
return <Text style={style}>
{pad(duration.minutes())}:{pad(duration.seconds())}:{pad(centiseconds)}</Text>
}

function RoundButton({title, color, background, onPress, disabled}) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, {backgroundColor: background, }]} activeOpacity={disabled ? 1.0 : 0.7}>
      <View style={styles.buttonBorder}>
      <Text style={{color: color}}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

function ButtonsRow({children}) {
  return (
    <View style={styles.buttonsRow}>

    </View>
  )
}

function Lap({number, interval}) {
  const lapStyle = [styles.lapText, fastest && styles.fastest,
  slowest && styles.slowest,
]

  return (
    <View style = {styles.lap}>
<Text style = {lapStyle}>Lap {number}</Text>
  <Timer style = {lapStyle} interval={interval}/>

    </View>
  )
}

function LapsTable({laps, timer}) {
  const finishedLaps = laps.slice(1)
  let min = Number.MIN_SAFE_INTEGER
  let max = Number.MAX_SAFE_INTEGER
  if (finishedLaps.length >= 2) {
    finishedLaps.forEach(
      lap=>{
        if (lap < min) min = lap
        if (lap > max) max = lap
      }
    )
  }
  return (
    
    <ScrollView style = {styles.scrollView}>
      {laps.map((lap, index) => {
        <Lap number={laps.length - index} 
        key = {laps.length-index} 
        interval={index ===0 ? timer + lap : lap}
        fastest = {lap === min}
        slowest = {lap === max}
        />
      })}
    </ScrollView>
  )
}

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      start: 0,
      now: 0,
      laps: [],
      running: false,
    }
  }
    
  
  start = () => {
    const now = new Date().getTime()
    this.setState({start: now,
    now,
    laps: [0], running: true})
    this.timer = setInterval(() => {
      this.setState ({now: new Date().getTime()})
    }, 100)
  }

  stop = () => {
    clearInterval(this.timer)
    const timestamp = new Date().getTime()
    const {laps, now, start} = this.state
    const [firstLap, ...other] = laps
    this.setState({laps: [0, firstLap + now - start, ...laps], running: false})
  }

  lap = () => {
    const timestamp = new Date().getTime()
    const {laps, now, start} = this.state
    const [firstLap, ...other] = laps
    this.setState({laps: [0, firstLap + now - start, ...laps], start: timestamp, now: timestamp})
  }

  reset = () => {
    clearInterval(this.timer)
    this.setState({laps: [], start: 0, now: 0 })
  }

  resume = () => {
    const now = new Date().getTime()
    this.setState({
      start: now,
      now,
      running: true,
    })
    this.timer = setInterval(() => {
      this.setState({ now: new Date().getTime()})
    }, 100)
  }
  
  render(){
    const {now, start, laps, running} = this.state
    const timer = now - start
    return (
      
      <View style={styles.container}>
        <Timer interval={laps.reduce((total, curr)=> total + curr, 0) + timer} style = {styles.timer}/>
        {/* <ButtonsRow>
        
        </ButtonsRow> */}

        {running && start > 0 &&
        (<View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'space-between', marginTop: 60}}>
        <RoundButton title = "Lap" color = "#8B8B90" background = "#151515" onPress = {this.lap}/>
        <RoundButton title = "Stop" color = "#E33935" background = "#3c1715" onPress = {this.stop}/></View>) 
        }

        {!running && start === 0 && (
        <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'space-between', marginTop: 60}}>
        <RoundButton title = "Reset" color = "#ffffff" background = "#3D3D3D" onPress = {this.reset} />
        <RoundButton title = "Start" color = "#5cfa28" background = "#1b361F" onPress = {this.start}/>

        </View>)}

        {!running && start > 0 && (
        <View style={{flexDirection: 'row', alignSelf: 'stretch', justifyContent: 'space-between', marginTop: 60}}>
        <RoundButton title = "Reset" color = "#ffffff" background = "#3D3D3D" onPress = {this.reset} />
        <RoundButton title = "Resume" color = "#5cfa28" background = "#1b361F" onPress = {this.resume}/>

        </View>)}
        
        

        <LapsTable laps={laps} timer = {timer}></LapsTable>
      </View>
    )
  }
}
// export default function App(){

//   function constructor(props) {
//     this.state = {
//       timer: 1232435,
//       start: 0,
//       now: 0,
//       laps: []

//     }
//   }
    
  

  
//   function render(){
//     const {timer, laps} = this.state
    
//     return (
      
//       <View style={styles.container}>
//         <Timer interval={timer} style = {styles.timer}/>
//         <ButtonsRow>
        
//         </ButtonsRow>
//         <RoundButton title = "Reset" color = "white" background = "#3D3D3D"/>
//         <RoundButton title = "Start" color = "#5cfa28" background = "#1b361F"/>
//         <LapsTable laps={laps}></LapsTable>
//       </View>
//     )
//   }
  
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    paddingTop: 130,
    paddingHorizontal: 20,
  },
  timer: {
    color: 'white',
    fontSize: 76,
    fontWeight: '200'
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 18,

  },
  buttonBorder: {
    width:76,
    height: 76,
    borderRadius: 38,
    borderWidth:2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    height: 90,
    // alignSelf: 'stretch',
    // justifyContent: 'space-between',
    marginTop: 60,
    marginBottom: 30,
  },
  lapText: {
    color: 'white',
    fontSize: 18,
    width: 30
  },

  lap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: "#151515",
    borderTopWidth: 1,
    paddingVertical: 10,

  },
  scrollView: {
    alignSelf: 'center',
    fontSize: 16,
    backgroundColor: '#151515'
  },

  fastest: {
    color: 'white',
  },

  slowest: {
    color: 'red',
  }
});
