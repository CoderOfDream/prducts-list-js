window.addEventListener('load',function(){
    document.querySelector('body').classList.add("loaded")  
  });
 

class Table {
    constructor() {
        this.tbody = document.querySelector('tbody');
        this.counter = 0;
        this.postsValue = null;
        this.getPosts();
        this.sortTh();
        this.search();
        this.pressOnNextBtn();
        this.pressOnPrevBtn();
    }

    sortTh() {
        document.addEventListener('DOMContentLoaded', () => {

            const getSort = ({ target }) => {
                const order = (target.dataset.order = -(target.dataset.order || -1));
                const index = [...target.parentNode.cells].indexOf(target);
                const collator = new Intl.Collator(['en', 'ru'], { numeric: true });
                const comparator = (index, order) => (a, b) => order * collator.compare(
                    a.children[index].innerHTML,
                    b.children[index].innerHTML
                );

                for (const tBody of target.closest('table').tBodies)
                    tBody.append(...[...tBody.rows].sort(comparator(index, order)));

                for (const cell of target.parentNode.cells)
                    cell.classList.toggle('sorted', cell === target);
            };

            document.querySelectorAll('.table thead').forEach(tableTH => tableTH.addEventListener('click', () => getSort(event)));
        });
    }

    getPosts(num = 0) {
        fetch('http://localhost:3000/posts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(json => json.json())
            .then(posts => {
                this.postsValue = posts.length;
                console.log(this.postsValue);
                const arr = [...posts.splice(num, 20)];
                arr.forEach(post => {
                    const tr = document.createElement('tr');
                    this.tbody.appendChild(tr);

                    const thId = document.createElement('th');
                    thId.innerHTML = post.id;
                    tr.appendChild(thId);

                    const thTitle = document.createElement('th');
                    thTitle.innerHTML = post.title;
                    thTitle.classList.add('title-text');
                    tr.appendChild(thTitle);

                    const thPrice = document.createElement('th');
                    thPrice.innerHTML = post.price;
                    tr.appendChild(thPrice);

                    const thColor = document.createElement('th');
                    thColor.innerHTML = post.color;
                    tr.appendChild(thColor);

                    const thDepartment = document.createElement('th');
                    thDepartment.innerHTML = post.department;
                    tr.appendChild(thDepartment);

                });
            });
    }

    pressOnNextBtn() {
        const nextBtn = document.querySelector('.second-btn');
        nextBtn.onclick = () => {
            if(this.counter >= this.postsValue - 20) return;
            this.tbody.innerHTML = '';
            this.counter += 20;
            this.getPosts(this.counter);
            console.log(this.counter);
        }
    }

    pressOnPrevBtn() {
        const nextBtn = document.querySelector('.first-btn');
        nextBtn.onclick = () => {
            if(this.counter <= 0) return;
            this.tbody.innerHTML = '';
            this.counter -= 20;
            this.getPosts(this.counter);
            console.log(this.counter);
        }
    }

    search() {
        document.querySelector('#search').oninput = (e) => {
            const val = e.target.value.trim();
            const items = document.querySelectorAll('.title-text');
            if (val != '') {
                items.forEach(el => {
                    let string = el.innerHTML.toLowerCase();
                    if (string.search(val) == -1) {
                        el.parentElement.style.display = 'none';
                    } else {
                        el.parentElement.style.display = 'table-row';
                    }
                })
            } else {
                items.forEach(el => {
                    el.parentElement.style.display = 'table-row';
                })
            }
        }
    }
}

const table = new Table();

