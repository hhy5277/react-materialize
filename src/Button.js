import React, { Component } from 'react';
import PropTypes from 'prop-types';
import constants from './constants';
import cx from 'classnames';
import Icon from './Icon';
import idgen from './idgen';

class Button extends Component {
  constructor(props) {
    super(props);
    this.renderIcon = this.renderIcon.bind(this);
    this.renderFab = this.renderFab.bind(this);
  }

  componentDidMount() {
    if (!M) return;

    const { tooltip, tooltipOptions = {}, fab } = this.props;
    if (tooltip) {
      this.instance = M.Tooltip.init(this._btnEl, tooltipOptions);
    }

    if (fab) {
      this.instance = M.FloatingActionButton.init(this._floatingActionBtn);
    }
  }

  componentWillUnmount() {
    if (this.instance) {
      this.instance.destroy();
    }
  }

  render() {
    const {
      className,
      node,
      fab,
      fabClickOnly,
      modal,
      flat,
      floating,
      large,
      small,
      disabled,
      waves,
      tooltip,
      ...other
    } = this.props;

    const toggle = fabClickOnly ? 'click-to-toggle' : '';
    let C = node;
    let classes = {
      btn: true,
      disabled,
      'waves-effect': waves
    };

    if (constants.WAVES.indexOf(waves) > -1) {
      classes['waves-' + waves] = true;
    }

    let styles = { flat, floating, large, small };
    constants.STYLES.forEach(style => {
      if (styles[style]) {
        classes.btn = false;
        classes['btn-' + style] = true;
      }
    });

    if (modal) {
      classes['modal-' + modal] = true;
    }
    if (fab) {
      return this.renderFab(cx(classes, className), fab, toggle);
    } else {
      return (
        <C
          {...other}
          disabled={!!disabled}
          onClick={this.props.onClick}
          className={cx(classes, className)}
          ref={el => (this._btnEl = el)}
          data-tooltip={tooltip}
        >
          {this.renderIcon()}
          {this.props.children}
        </C>
      );
    }
  }

  renderFab(className, mode, clickOnly) {
    const classes = cx(this.getFabClasses(mode), clickOnly);
    return (
      <div
        ref={el => (this._floatingActionBtn = el)}
        className={cx('fixed-action-btn', classes)}
        style={this.props.style}
      >
        <a className={className}>{this.renderIcon()}</a>
        <ul>
          {React.Children.map(this.props.children, child => {
            return <li key={idgen()}>{child}</li>;
          })}
        </ul>
      </div>
    );
  }

  getFabClasses(mode) {
    if (mode === 'toolbar') return mode;
    // keep retrocompatibility on old params
    if (mode === 'vertical') mode = 'top';
    if (mode === 'horizontal') mode = 'left';
    return `direction-${mode}`;
  }

  renderIcon() {
    const { icon } = this.props;
    if (!icon) return;

    return <Icon>{icon}</Icon>;
  }
}

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  /**
   * Enable other styles
   */
  flat: PropTypes.bool,
  large: PropTypes.bool,
  small: PropTypes.bool,
  floating: PropTypes.bool,
  /**
   * Fixed action button
   * If enabled, any children button will be rendered as actions, remember to provide an icon.
   * @default vertical. This will disable any onClick function from being called on the main button.
   */
  fab: PropTypes.oneOf([
    'vertical',
    'horizontal',
    'top',
    'bottom',
    'left',
    'right',
    'toolbar'
  ]),
  /**
   * The icon to display, if specified it will create a button with the material icon.
   */
  icon: PropTypes.string,
  modal: PropTypes.oneOf(['close', 'confirm']),
  node: PropTypes.node,
  /**
   * Will be disabled when fab is set.
   */
  onClick: PropTypes.func,
  /**
   * Tooltip to show when mouse hovered
   */
  tooltip: PropTypes.string,
  /**
   * Tooltips options as here
   * http://archives.materializecss.com/0.100.2/dialogs.html#tooltip
   */
  tooltipOptions: PropTypes.shape({
    delay: PropTypes.number,
    position: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
    tooltip: PropTypes.string,
    html: PropTypes.bool
  }),
  waves: PropTypes.oneOf([
    'light',
    'red',
    'yellow',
    'orange',
    'purple',
    'green',
    'teal'
  ]),
  /**
   * FAB Click-Only
   * Turns a FAB from a hover-toggle to a click-toggle
   */
  fabClickOnly: PropTypes.bool,
  /**
   * Styles
   */
  style: PropTypes.object
};

Button.defaultProps = {
  node: 'button'
};

export default Button;
