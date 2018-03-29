import React from 'react'
import styles from 'stylesheets/card_maker/card_editor'

function fieldWrapper(WrappedElmt, options) {
  options = options || {};

  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        tab: 'default'
      }
    }

    label = () => {
      var result;

      if (options.customTab) {
        result = (
          <div className={[styles.fieldLabel, styles.fieldLabelTabs].join(' ')}>
            <div 
              className={[
                styles.fieldTab, 
                styles.fieldTabLeft,
                (this.state.tab === 'default' ? null : styles.isFieldTabInactive)
              ].join(' ')}
              onClick={() => this.setState({ tab: 'default' })}
            >
              <div>{this.props.field.label}</div>
            </div>
            <div 
              className={[
                styles.fieldTab, 
                styles.fieldTabRight,
                (this.state.tab === 'custom' ? null : styles.isFieldTabInactive)
              ].join(' ')}
              onClick={() => this.setState({ tab: 'custom' })}
            >
              <div>Custom</div>
            </div>
          </div>
        );
      } else {
        result = (
          <div className={styles.fieldLabel}>
            <div>{this.props.field.label}</div>
          </div>
        );
      }

      return result;
    }

    render() {
      var innerClassName = 'field';

      if (options.noBorder) {
        innerClassName += ' no-border';
      }

      return (
        <div className='field-wrap'>
          {this.label()}
          <div className={innerClassName}>
            <WrappedElmt 
              fieldTab={this.state.tab}
              requestFieldTab={(tab) => this.setState({ tab: tab })}
              {...this.props} 
            />
          </div>
        </div>
      )
    }
  }
}

export default fieldWrapper
