function request(url, method, param, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-type', 'application/json')
  xhr.withCredentials = false;
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200 || xhr.status == 304) {
        var gotServices = JSON.parse(xhr.responseText)
        callback(gotServices);
      } else {
        callback();
        console.log('ajax失败了')
      }
    }
  }
  if (param) {
    xhr.send(JSON.stringify(param));
  } else {
    xhr.send();
  }
}

var rankingList;

const fetchList = () => {
  request('https://api.whosmeya.com/public/api/tadpole-ranking', 'GET', null, function (res) {
    if (typeof res == 'undefined') return;
    rankingList = res;
    var ranking = document.getElementById('ranking');
    let domStr = `
    <h3>排行榜</h3>
    <table>
      <thead>
        <tr>
          <th>排名</th>
          <th>昵称</th>
          <th>用时</th>
        </tr>
      </thead>
  `;
    res.forEach((d, i) => {
      domStr += `
      <tr>
        <th>${i + 1}</th>
        <th>${d.name}</th>
        <th>${((d.use_time || 0) / 1000).toFixed(3)}</th>
      </tr>
    `;
    });
    domStr += '</table>';
    ranking.innerHTML = domStr;
  });
}

fetchList();

const newRanking = () => {
  var name = document.getElementById('rankingNameIpt').value;
  if (!name) {
    alert('请输入昵称');
    return;
  }
  if (name.length > 20) {
    alert('昵称短点!');
    return;
  }
  var param = {
    name: name,
    use_time: time,
  }
  request('https://api.whosmeya.com/public/api/tadpole-ranking', 'POST', param, function (res) {
    fetchList();
  })
  newRankingVisible = false;
  document.getElementById('submitBox').classList.add('hide');
}

