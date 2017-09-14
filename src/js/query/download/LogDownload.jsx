import React from 'react'
import ReactDOM from 'react-dom'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import { Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FileFileDownload from 'material-ui/svg-icons/file/file-download';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import AvReplay from 'material-ui/svg-icons/av/replay';
import PageBar from 'barcsys-components/PageBar'
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import NavigationSubdirectoryArrowLeft from 'material-ui/svg-icons/navigation/subdirectory-arrow-left';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from './redux/actions'
import moment from 'moment';
moment.locale('zh-CN');
import { tapeService } from 'appconfig/apiUrl'

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    height: 'calc(100% - 5rem)',
  },
  logContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexWrap: 'wrap',
  }
};

class LogDownload extends React.Component {

  componentDidMount() {
    this.props.loadList();
  }

  componentDidUpdate() {
    // this.props.loadList();
  }

  rendStatusBar() {
    let {cnt, pageNumText, queryData, maxPageNum, turnPage, setStateValue} = this.props;
    return <PageBar>
      <Toolbar>
        <ToolbarGroup firstChild={true}>
          <ToolbarTitle text={`共${cnt}条生成日志`}
            style={{ fontWeight: '300', fontSize: '1rem', marginLeft: '1rem' }} />
        </ToolbarGroup>
        <ToolbarGroup>
          <IconButton style={{ lineHeight: '56px' }}
            onClick={_ => turnPage(queryData.currentPageIdx)}>
            <NavigationChevronLeft />
          </IconButton>
          <TextField name="pageNumText" value={pageNumText}
            style={{ width: '2rem', margin: '0rem 1rem' }}
            inputStyle={{ textAlign: 'center' }}
            onChange={(e) => { setStateValue('pageNumText', e.target.value) } } />
          <ToolbarTitle text={'/' + maxPageNum} />
          <IconButton style={{ lineHeight: '56px' }}
            onClick={_ => turnPage(queryData.currentPageIdx + 2)}>
            <NavigationChevronRight />
          </IconButton><IconButton style={{ lineHeight: '56px' }}
            onClick={_ => turnPage(parseInt(pageNumText))}>
            <NavigationSubdirectoryArrowLeft />
          </IconButton>
        </ToolbarGroup>
      </Toolbar>
    </PageBar>
  }

  rendTable(listData) {
    return <Table
      wrapperStyle={{
        padding: '5rem 1rem 0rem 1rem'
      }}
      selectable={false}
      multiSelectable={false}
      fixedHeader={true}
      >
      <TableHeader
        displaySelectAll={false}
        adjustForCheckbox={false}
        enableSelectAll={false}
        >
        <TableRow>
          <TableHeaderColumn tooltip="查询条件">查询条件</TableHeaderColumn>
          <TableHeaderColumn style={{ width: '10rem' }} tooltip="开始时间">开始时间</TableHeaderColumn>
          <TableHeaderColumn style={{ width: '3rem' }} tooltip="状态">状态</TableHeaderColumn>
          <TableHeaderColumn style={{ width: '5rem' }} tooltip="操作">操作</TableHeaderColumn>
        </TableRow>
      </TableHeader>
      <TableBody
        displayRowCheckbox={false}
        deselectOnClickaway={false}
        showRowHover={true}
        stripedRows={false}
        >
        {listData.map((row, index) => (
          <TableRow key={row._id} selected={row.selected}>
            <TableRowColumn style={{
              paddingTop: '0.5rem', paddingBottom: '0.5rem',
              wordBreak: 'break-all', whiteSpace: 'normal'
            }}>
              {JSON.stringify(row.searchCondition)}</TableRowColumn>
            <TableRowColumn style={{ width: '10rem' }}>{moment(row.createTime).format("YYYY-MM-DD HH:mm:ss")}</TableRowColumn>
            <TableRowColumn style={{ width: '3rem' }}>{row.status}</TableRowColumn>
            <TableRowColumn style={{ width: '5rem' }}>
              <IconButton disabled={row.status !== 'finished'} style={{ verticalAlign: 'initial' }}
                href={tapeService.download + '/' + row._id} target="_blank" download>
                <FileFileDownload /></IconButton>
              <IconButton disabled={row.status !== 'failed'} style={{ verticalAlign: 'initial' }}
                onClick={() => this.props.redoTask(row._id)}>
                <AvReplay /></IconButton>
              <IconButton><ActionDelete /></IconButton></TableRowColumn>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  }

  render() {
    let {filesData} = this.props;
    return <div style={styles.root}>
      {this.rendStatusBar()}
      <div style={styles.logContainer}>
        {this.rendTable(filesData)}
      </div>
    </div>
  }
}

function mapStateToProps(state) {
  return {
    filesData: state.page.filesData,
    cnt: state.page.cnt,
    pageNumText: state.page.pageNumText,
    maxPageNum: state.page.maxPageNum,
    queryData: state.page.queryData,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LogDownload);