'use strict';
// id=0にイベント設定
setEvent(0);

//ulの親子判定用
//address配列のインデックス番号が、そのulのid番号
//親要素のidが配列内にすべて入っている。
let address = [
    [0]
];

// hamクラスの付いた要素を取得して、非表示にする。
document.getElementById('hamburger').onclick = function() {
    let forms = document.querySelectorAll('.ham');
    forms.forEach(function(item, index) {
        item.classList.toggle('hidden');
    });
};

// ここから入れ子追加機能のファンクション------------------------------------
// ulを追加するfunction----------------------------------------------
let ulCount = 0;// 新しいulができるたびにカウント
// パラメータとしてクリックされたidを受け取る
function newUl(id) {
    if(ulpicked1 !== '') {
        window.alert('ul選択中は新しいulを作れません');
    } else {
        ulCount++ // 新しいidはulCount
        let ul = `
            <li id="${ulCount}">
                <form action="#" id="form-${ulCount}" data-id="${ulCount}" class="ham">
                    <input type="text" name="listContent">
                    <input type="submit" value="liの追加">
                </form>
                <button id="b-${ulCount}" data-id="${ulCount}" class="ham">ulの追加</button>
                <button id="delete-${ulCount}" data-id="${ulCount}" class="ham">ul削除</button>
                <button id="pick-${ulCount}" data-id="${ulCount}" class="p-btn">ulpick</button>
                <button id="fold-${ulCount}" data-id="${ulCount}">折りたたむ</button>
                <ul id="ul-${ulCount}"></ul>
            </li>
        `;
        document.getElementById(`ul-${id}`).insertAdjacentHTML('beforeend', ul);
        
        // イベント設定
        setEvent(ulCount);
    
        //address配列に追加
        let thisAddress = [];
        // address[id]は一個上のulのアドレス配列
        address[id].forEach(function(item, index) {
            thisAddress.push(item);// 親のアドレスをコピー
        })
        thisAddress.push(ulCount);// コピーした親のアドレスに自分自身のIDを追加=>これが自分のアドレスになる
        address.push(thisAddress);
        // console.log(address);
    }
}

// liを追加するファンクション---------------------------------------------------
// 第二引数として、afterbegin または beforeendをわたす
// BorE => begin or end
function newLi(id, BorE) {
    let content = document.getElementById(`form-${id}`).listContent.value;
    if(content === '') {
        // テキストボックスが空だとアラート
        window.alert('なにか入力してください');
    } else if(ulpicked1 !== '' || picked1 !== '') {
        window.alert('選択中は新しい項目を追加できません。');
    }else {
        let li = `
            <li class="li-item">
                <span>${content}</span>
            </li>
            <button class="deleteButton ham">削除</button>
        `;
        document.getElementById(`ul-${id}`).insertAdjacentHTML(BorE, li);
        document.getElementById(`form-${id}`).listContent.value = '';

        setDeleteButton();// 削除ボタンのイベント設定

        setPicked();// ピック機能のイベント設定
    }
}

function setDeleteButton() {
    let deleteButton = document.querySelectorAll('.deleteButton');
    deleteButton.forEach(function(item, index) {
        item.onclick = function() {
            if(ulpicked1 !== '') {
                window.alert('ul選択中は削除できません');
            } else if(picked1 === '' && picked2 === '' && ulpicked1 === '' && ulpicked2 === '') {
                this.previousElementSibling.remove();
                this.remove();
            } else {
                window.alert('pick中なので削除できません。');
            }
        };
    });
}

// 折り畳み機能のファンクション----------------------------
function fold(id) {
    let ul = document.getElementById(`ul-${id}`);
    let fold = document.getElementById(`fold-${id}`);
    if(ul.style.display === 'none') {
        ul.style.display = 'block';
        fold.style.color = 'black';
        fold.textContent = '折りたたむ';
    } else {
        ul.style.display = 'none';
        fold.style.color = 'red';
        fold.textContent = 'オープン';
    }
}

// リストの順番を入れ替える機能function
let picked1 = '';
let picked2 = '';
function setPicked() {
    let liAll = document.querySelectorAll('.li-item');
    liAll.forEach(function(item, index) {
        item.onclick = function() {
            resetUlPick();
            if(picked1 === '') {
                // 1回目のクリック
                picked1 = this.textContent;
                this.style.opacity = '.5';
                this.id = 'picked';
            } else if(this.textContent === 'picked') {
                document.getElementById('picked').textContent = picked1;
                document.getElementById('picked').id = '';
                picked1 = '';
                picked2 = '';
            } else if(picked1 !== '' && this.textContent !== 'picked') {
                // 2回目のクリック
                picked2 = this.textContent;
                this.textContent = picked1;
                document.getElementById('picked').style.opacity = 1;
                document.getElementById('picked').textContent = picked2;
                document.getElementById('picked').id = '';
                picked1 = '';
                picked2 = '';
            }
        }
    })
}

// ulの順番を入れ替えるための変数
// 移動元の要素を１、移動先の要素を２とする。
let ulpicked1 = '';
let ulpicked2 = '';
let pickedId1 = '';
let address1 = [];
let address2 = [];
let childrenId1 = [];
let childrenId2 = [];

//------------------------------
function setEvent(id) {
    //ulを追加ボタン
    document.getElementById(`b-${id}`).onclick = function() {
        let id = this.dataset.id;
        newUl(id);
    };
    //ul削除ボタン
    if(id !== 0) {//idが0のとき、ulの削除ボタンはない
        document.getElementById(`delete-${id}`).onclick = function() {
            let id = this.dataset.id;
            if(ulpicked1 !== '' || picked1 !== '') {
                window.alert('選択中は削除できません。')
            } else if(window.confirm('ulの中身がすべて消えます。よろしいですか？')) {
                document.getElementById(id).remove();
            }
        };
    }
    
    //ulpickボタン
    if(id !== 0) {
        document.getElementById(`pick-${id}`).onclick = function() {
            resetLiPick();
            let id = this.dataset.id;
            let li = document.getElementById(id); // クリックされた親のli
            if(ulpicked1 === '') {
                // 1回目のクリック
                pickedId1 = li.id;
                ulpicked1 = li.innerHTML;
                li.style.opacity = .333;
                address[pickedId1].forEach(function(item, index) {
                    address1.push(item);
                });
                let children = li.querySelectorAll('.p-btn');
                children.forEach(function(item, index) {
                    let thisId = parseInt(item.dataset.id);
                    childrenId1.push(thisId);// 自分含む子要素
                })
            } else if(pickedId1 === id) {
                // 同じ要素をクリックしたら、選択解除（リセット）
                resetUlPick();

            } else if(childrenId1.includes(parseInt(id))) {
                // 2が1の子孫だった場合
                // １の選択をリセットして、選択をこのidに変更
                resetUlPick();

                pickedId1 = li.id;
                ulpicked1 = li.innerHTML;
                li.style.opacity = .333;
                address[pickedId1].forEach(function(item, index) {
                    address1.push(item);
                });
                let children = li.querySelectorAll('.p-btn');
                children.forEach(function(item, index) {
                    let thisId = parseInt(item.dataset.id);
                    childrenId1.push(thisId);// 自分含む子要素
                })
            } else if(address[pickedId1].includes(parseInt(id))) {
                //2が親要素だった場合
                resetUlPick();
                pickedId1 = li.id;
                ulpicked1 = li.innerHTML;
                li.style.opacity = .333;
                address[pickedId1].forEach(function(item, index) {
                    address1.push(item);
                });
                let children = li.querySelectorAll('.p-btn');
                children.forEach(function(item, index) {
                    let thisId = parseInt(item.dataset.id);
                    childrenId1.push(thisId);// 自分含む子要素
                })
            } else {
                // 2回目のクリックで、かつ、１と親子ではない。⇒入れ替え実行
                let children = li.querySelectorAll('.p-btn');
                children.forEach(function(item, index) {
                    let thisId = parseInt(item.dataset.id);
                    childrenId2.push(thisId);// 自分含む子要素
                })

                //アドレスの変更
                // 移動前の２のアドレス::adress2を作成
                address[parseInt(id)].forEach(function(item, index) {
                    address2.push(item);
                });

                address1.pop();// アドレスから自分自身を消去
                address2.pop();

                let length1 = address1.length;
                let length2 = address2.length;// 先祖の数

                // これは逆向きにしないといけない。unshiftで頭に追加するから。
                let core1 = address1.splice(0, length1).reverse();
                let core2 = address2.splice(0, length2).reverse();

                // length回shiftして、coreをunshift
                childrenId1.forEach(function(item, index) {
                    for(let i=1; i <= length1; i++) {
                        address[item].shift();
                    }
                    core2.forEach(function(itemB, index2) {
                        address[item].unshift(itemB);
                    })
                })
                childrenId2.forEach(function(item, index) {
                    for(let i = 1; i <= length2; i++) {
                        address[item].shift();
                    }
                    core1.forEach(function(itemB, indexB) {
                        address[item].unshift(itemB);
                    })
                })
                // ここまで、アドレスの変更

                //ここから要素の中身とidの変更
                ulpicked2 = li.innerHTML;//2の中身
                li.innerHTML = ulpicked1;// 2に1の中身を入れる
                document.getElementById(pickedId1).innerHTML = ulpicked2;// 1に2の中身を入れる
                document.getElementById(pickedId1).style.opacity = '1';// opacityを元に戻す
                document.getElementById(pickedId1).id = li.id;//1のidを2のidにする    
                li.id = pickedId1;//2のidを1のidにする
                //ここまで要素の中身や、IDの変更

                // ここからイベント再設定
                let allId = [];// 移動した要素のすべてのIDを、この配列に入れる
                let forms1 = document.getElementById(pickedId1).querySelectorAll('form');
                // form要素は1つのulにつき、1つだけ。これのdata-idを利用する。
                forms1.forEach(function(item, index) {
                    let dataId = item.dataset.id;
                    allId.push(dataId);// 1の子孫要素すべてのidをpushできた
                });

                let forms2 = document.getElementById(id).querySelectorAll('form');
                forms2.forEach(function(item, index) {
                    let dataId = item.dataset.id;
                    allId.push(dataId);// 2の子孫要素すべてのidをpushできた
                });

                // allIdにsetEvent()
                allId.forEach(function(item, index) {
                    setEvent(item);
                });

                // li関連のイベント再設定
                setPicked();
                setDeleteButton();
                // ここまで、イベント再設定

                //変数の中身リセット
                resetUlPick();
            }
        }
    }

    //li追加ボタン
    document.getElementById(`form-${id}`).onsubmit = function(e) {
        e.preventDefault();
        let BorE;
        if(document.getElementById('checkbox').checked) {
            BorE = 'afterbegin';
        } else {
            BorE = 'beforeend';
        }
        newLi(this.dataset.id, BorE);
    };
    //折りたたみボタン
    document.getElementById(`fold-${id}`).onclick = function() {
        fold(this.dataset.id);
    };
}
// ここまで、setEvent(id)ファンクション

function resetLiPick() {
    if(picked1 !== '') {
        document.getElementById('picked').style.opacity = 1;
        document.getElementById('picked').textContent = picked1;
        document.getElementById('picked').id = '';
        picked1 = '';
        picked2 = '';
    }
}

function resetUlPick() {
    if(ulpicked1 !== '') {
        document.getElementById(pickedId1).style.opacity = 1;
        ulpicked1 = '';
        ulpicked2 = '';
        pickedId1 = '';
        address1 = [];
        address2 = [];
        childrenId1 = [];
        childrenId2 = [];
    }
}