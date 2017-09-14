import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import CircularProgress from 'material-ui/CircularProgress';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Paper from 'material-ui/Paper';
import PageBar from 'barcsys-components/PageBar'
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import NavigationSubdirectoryArrowLeft from 'material-ui/svg-icons/navigation/subdirectory-arrow-left';
import { grey500, green500 } from 'material-ui/styles/colors';
import ActionSearch from 'material-ui/svg-icons/action/search';
import muiThemeable from 'material-ui/styles/muiThemeable';
import * as actions from './redux/actions'
import { enhenceAction } from 'barcsys-dashboard/commons/actions'
import { fromHex } from 'barcsys-dashboard/commons/commonFunc'
import RulePanel from './RulePanel'

import AppAutoComplete from "barcsys-components/AppAutoComplete";
const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    height: 'calc(100% - 5rem)'
  },
  cardContainer: {
    width: 'calc(100% + 1.1rem)',
    height: '100%',
    overflowY: 'auto',
    display: 'flex',
    flexWrap: 'wrap'
  }
};

class AlertRules extends Component {
  constructor(props) {
    super(props);
  }

  // buildFootprint(fp,routes,appId) {
  //   let footprint = {};
  //   footprint.prev = fp.map(item => { return { name: item.n, path: item.u } })
  //   footprint.cur = { name: routes[routes.length - 1].name }
  //   footprint.next = [{ name: appId }]
  //   return footprint
  // }

  componentWillMount() {
    let { setAppId, loadAppData, loadServiceData, routes, setFootprint } = this.props;
    // let {fp} = this.props.location.query;
    loadAppData();
    // if (fp) {
    //   let rawFootprint = JSON.parse(fromHex(fp));
    //   setFootprint(this.buildFootprint(rawFootprint, routes, params.appId));
    //   this.back = function (jumpTo) {
    //     jumpTo(rawFootprint[rawFootprint.length-1].u)
    //   }
    // }
  }

  componentDidUpdate() {
    // this.props.loadServiceData();
  }

  statusColor(status) {
    switch (status) {
      case true:
        return grey500;
      case false:
        return green500;
    }
  }

  listFileter(value, listData) {
    if (value === '') return listData;
    return listData.filter((item) => {
      let flag = false;
      for (let key in item) {
        if (key !== 'app' && key !== 'title' && key !== 'description' && key !== 'createdBy') continue;
        if (item[key].indexOf(value) > -1) {
          flag = true;
          break;
        }
      }
      return flag
    })
  }

  getAppName(appData, appId) {
    let result = appData.find(item => item._id === appId);
    if (result == null) {
      return '';
    } else {
      return result.name;
    }
  }

  rendCard(card) {
    let { updateService, deleteService, jumpTo, muiTheme,
      showEditRulePanel, doingSubmit } = this.props;
    let { shouldTriggerEvent, description, _id, createdWhen, createdBy, app, rules, title, isDisabled } = card;
    return <Card key={_id} style={{ width: '20rem', margin: '1rem', maxHeight: '15rem' }}>
      <CardMedia>
        <div style={{ background: this.statusColor(isDisabled), paddingLeft: '1rem', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', paddingTop: '1rem' }}>
            <h1 style={{
              fontSize: '2rem', fontWeight: 'normal', color: muiTheme.palette.alternateTextColor,
              lineHeight: '3rem', margin: '0', wordBreak: 'break-all', width: '100%'
            }}>{title}</h1>
            <IconMenu
              style={{ float: 'right' }}
              iconButtonElement={<IconButton><MoreVertIcon color="white" /></IconButton>}
              anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            >
              {isDisabled ?
                <MenuItem disabled={doingSubmit} primaryText={'启用规则'} onClick={() => { card.isDisabled = false; updateService(card) }} /> :
                <MenuItem disabled={doingSubmit} primaryText={'禁用规则'} onClick={() => { card.isDisabled = true; updateService(card) }} />
              }
              <MenuItem disabled={doingSubmit} primaryText="编辑规则" onClick={() => { showEditRulePanel(card) }} />
              <MenuItem disabled={doingSubmit} primaryText="删除" onClick={() => { deleteService(card) }} />
            </IconMenu></div>
          <span style={{ color: 'white', display: 'block', fontSize: '1rem', paddingBottom: '1rem', height: '1rem' }}>{}</span>
        </div>
      </CardMedia>
      <table style={{ margin: '1rem 0rem 1rem 0rem', width: '100%' }}>
        <tbody>
          <tr><td style={{ paddingLeft: '1rem' }}>状态: </td><td style={{
            textAlign: 'right', paddingRight: '1rem',
            color: this.statusColor(isDisabled)
          }}>{isDisabled ? '禁用' : '启用'}</td></tr>
          <tr><td style={{ paddingLeft: '1rem' }}>创建人: </td><td style={{ textAlign: 'right', paddingRight: '1rem' }}>{createdBy}</td></tr>
          <tr><td style={{ paddingLeft: '1rem' }}>描述: </td><td style={{ textAlign: 'right', paddingRight: '1rem' }}
            title={description}>{description.length > 23 ? description.substr(0, 20) + '...' : description}</td></tr>
        </tbody>
      </table>
    </Card>
  }

  rendAppDropDown() {
    /*return appData.length > 0 ? <DropDownMenu style={{ whiteSpace: 'nowrap' }}
      value={selectedApp} onChange={(e, key, payload) => this.props.selectApp(payload)}>
      {appData.map(item => <MenuItem key={item._id} value={item._id} primaryText={item.name} />)}
    </DropDownMenu> :
      <DropDownMenu value="Loading">
        <MenuItem value="Loading" primaryText="Loading" />
      </DropDownMenu>*/
    let { appData, selectApp, defaultAppName } = this.props;
    return (
      <AppAutoComplete
        width="14rem"
        style={{ marginLeft: "1rem", marginBottom: '1rem' }}
        floatingLabelText="点击过滤"
        openOnFocus={true}
        onNewRequest={(item, index, value) => selectApp(value)}
        filter={() => true}
      />
    )
  }

  rendSearchBar() {
    let { selectedApp, changeSearchStr, appId, turnPage, doQuery, isLoading, pageNumText,
      setStateValue, appData, searchStr, queryData } = this.props;
    // let fp = this.buildfp(routes);
    return <PageBar>
      <Toolbar>
        <ToolbarGroup firstChild={true}>
          {appId == null ? null : <IconButton onClick={backward}>
            <NavigationArrowBack /></IconButton>}
          {appId == null ? this.rendAppDropDown() :
            <ToolbarTitle text={this.getAppName(appData, appId)} />}
          {/*<ToolbarSeparator />
            <IconButton disableTouchRipple={true} style={{ marginLeft: '1rem' }}>
              <ActionSearch />
            </IconButton> <TextField hintText="请输入要过滤的字段" name='searchStr' value={searchStr}
                onChange={(e) => this.props.setStateValue('searchText', e.target.value)}
                onKeyPress={(e) => { e.key === 'Enter' && setQueryText() } }
                />*/}
        </ToolbarGroup>
        {/*<ToolbarGroup>
            <IconButton disabled={isLoading} style={{ lineHeight: '56px' }}
              onClick={_ => turnPage(queryData.get('currentPageIdx') - 1)}>
              <NavigationChevronLeft />
            </IconButton>
            <TextField name="pageNumText" value={pageNumText}
              style={{ width: '2rem', margin: '0rem 1rem' }}
              inputStyle={{ textAlign: 'center' }}
              onChange={(e) => { setStateValue('pageNumText', e.target.value) } } />
            <ToolbarTitle text={'/' + queryData.get('totalPageCount')} />
            <IconButton disabled={isLoading} style={{ lineHeight: '56px' }}
              onClick={_ => turnPage(queryData.get('currentPageIdx') + 1)}>
              <NavigationChevronRight />
            </IconButton><IconButton style={{ lineHeight: '56px' }} disabled={isLoading}
              onClick={_ => turnPage(parseInt(pageNumText) - 1)}>
              {isLoading ? <RefreshIndicator size={40} left={10} top={8} status="loading" /> :
                <NavigationSubdirectoryArrowLeft />}
            </IconButton>
          </ToolbarGroup>*/}
      </Toolbar>
    </PageBar>
  }

  render() {
    let { showAddRulePanel, instancesData,
      changeSearchStr, rulePanelOpenFlag, doingSubmit } = this.props;
    return (
      <div style={styles.root}>
        <RulePanel />
        {this.rendSearchBar()}
        <div style={{
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          marginTop: '4rem'
        }}>
          <div style={styles.cardContainer}>
            {instancesData.map(card => this.rendCard(card))}
          </div>
        </div>
        {doingSubmit ?
          <CircularProgress style={{ position: 'fixed', right: '5rem', bottom: '5rem', zIndex: '1' }} size={60} thickness={5} />
          : <FloatingActionButton style={{ position: 'fixed', right: '5rem', bottom: '5rem', display: rulePanelOpenFlag ? 'none' : 'block', zIndex: '1' }}
            onClick={() => showAddRulePanel()}>
            <ContentAdd />
          </FloatingActionButton>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    instancesData: state.page.instancesData,
    searchStr: state.page.searchStr,
    selectedApp: state.page.selectedApp,
    appId: state.page.appId,
    appData: state.page.appData,
    pageNumText: state.page.pageNumText,
    isLoading: state.page.isLoading,
    queryData: state.page.queryData,
    rulePanelOpenFlag: state.page.rulePanelOpenFlag,
    doingSubmit: state.page.doingSubmit,
    defaultAppName: state.page.defaultAppName
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(enhenceAction(actions), dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(muiThemeable()(AlertRules));
