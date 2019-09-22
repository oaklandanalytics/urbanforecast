import React from 'react'
import autoBind from 'react-autobind'
import numeral from 'numeral'
import _ from 'underscore'

export default class Legend extends React.Component {
  constructor(props) {
    super(props)
    autoBind(this)
  }

  getIStyle(v) {
    return {
      width: 18,
      height: 18,
      float: 'left',
      marginRight: 8,
      opacity: 1.0,
      background: v,
    }
  }

  // format the number appropriately for the legend
  formatNumber(num) {
    if (this.props.dontFormatLegend) return num

    if (!_.isNumber(num)) return num

    if (num < -1000000 || num > 1000000) {
      return numeral(num / 1000000).format('0,0.0') + 'M'
    }
    if (num < -1000 || num > 1000) {
      return numeral(num / 1000).format('0,0.0') + 'k'
    }
    if (num < 1.0 && num > -1.0 && num != 0) {
      if ((num * 10) % 1 != 0) {
        return numeral(num).format('.00')
      } else {
        return numeral(num).format('.0')
      }
    }
    if (num % 1 != 0 && num <= 20) {
      return numeral(num).format('0.0')
    }
    if (num % 1 != 0) {
      return (num = Math.floor(num))
    }
    return num
  }

  render() {
    if (!this.props.grades) return <span></span>

    var legendStyle = {
      position: 'absolute',
      left: '13px',
      bottom: '13px',
      padding: '6px 8px',
      background: 'rgba(255,255,255,0.95)',
      boxShadow: '0 0 15px rgba(0,0,0,0.2)',
      borderRadius: '5px',
      textAlign: 'left',
      lineHeight: '19px',
      color: '#555',
    }

    var h4Style = {
      margin: '0 0 5px',
      color: '#777',
    }

    var heading = this.props.heading ? <h4 style={h4Style}>{this.props.heading}</h4> : ''

    var that = this

    var grades = this.props.grades.map(this.formatNumber)

    return (
      <div style={legendStyle}>
        {heading}

        {grades.map(function(v, i) {
          return (
            <div key={i}>
              <i style={that.getIStyle(that.props.colors[i])}></i>
              {v}
            </div>
          )
        })}
      </div>
    )
  }
}
