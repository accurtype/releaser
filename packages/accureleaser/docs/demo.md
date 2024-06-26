# 功能快速开发流程示例

以下较为全面地描述了一个功能快速开发的示例。
其中，“管理工具”表示能够实现功能快速开发的工具。
本工具也属于一个“管理工具”。

- 突然想开发一个功能：自动爆炸功能，英文名是 auto explode 。

- 开始开发，美滋滋。

  为了防止开发分支间的依赖关系过于复杂，任何功能都应在正式版本的基础上进行开发。
  所以第一步是在 `master` 分支上通过管理工具新建一个分支 `dev-autoExplode` （以下简称 A 分支），并且描述了一下这个分支所开发的功能，就是“人机分离十米自动爆炸”。

（不断展开下方的文本，可以浏览不同情况下的开发示例）

<details><summary>1) 单个包</summary>

- 在仓库中 `bomb` 包的 `3.2.4` 正式版本的基础上进行开发。
  第一次开发提交后管理工具将版本号改为 `bomb@3.2.4-dev.autoExplode.alpha.0` ，表示这个包正处在开发阶段。

- 又提交了几次，比如添加了爆炸函数。

- 感觉自己可以了，修改版本号——这次提交产生了一个开发版本 `bomb@3.2.4-dev.autoExplode.alpha.1` ，被管理工具自动发布。

<details><summary>2) 单分支</summary>

- 继续上述开发流程，开发版本不断递增。

- 开发到某一阶段，可能恰好这时正式版本 `bomb@3.3.0` 发布了。

  为了防止开发完成后 PR 出现代码合并问题，最好是在新的正式版本出现后立马采用这个版本来继续开发。
  这样子即使这个版本和当前的代码有合并问题，也能在当下清楚地知道是新版的什么功能导致的。

  通过管理工具，基于 Git 的 `rebase` 命令把 `3.3.0` 版本引入 A 分支。
  引入完成后，管理工具将包版本号修正为 `bomb@3.3.0-dev.autoExplode.xxx.x` 。

- 不断地开发后，到达了 `bomb@3.3.0-dev.autoExplode.beta.0` 版本。

  推送到远程后，通过 GitHub PR 功能合并到 `next` 分支。
  管理工具验证 A 分支的 `bomb` 包确实已经达到了 `beta` 开发阶段及以上，允许合并分支。
  分支合并完后，管理工具为 `next` 分支上 `bomb` 包的次版本号递增一次，自动发布。

- 不断地开发后，到达了 `bomb@3.3.0-dev.autoExplode.release.0` 版本。

  推送到远程后，通过 GitHub PR 功能合并到 `master` 分支。
  管理工具验证 A 分支的 `bomb` 包确实已经达到了 `release` 开发阶段及以上，允许合并分支。
  分支合并完后，管理工具为 `master` 分支上 `bomb` 包的次版本号递增一次，自动发布。

  由于我们已经描述过功能，便可以用我们的描述来生成“Change Log”——“本次更新了：人机分离十米自动爆炸功能”。

  管理工具删除 npm 上的 `dev-autoExplode` 标签——这意味着这个功能基本开发完成，基本不再有大更新了。

-----

</details><!-- 2) 单分支 -->

<details><summary>2) 多分支</summary>

- 又开发了几下，发现“侦测人机分离”的功能比较复杂，于是打算把这个功能单独列出来开发。
  于是通过管理工具在 `master` 分支或 A 分支上新建分支 `dev-detectHuman` （以下简称 B 分支），功能描述为“侦测人机分离”。

- 在这个分支上的开发和上述“单分支”的示例一模一样；
  如果这个分支又有需要单列出来的功能，那么就再继续新建一个分支。
  ——多分支和单分支开发的差别在 B 分支上基本没有体现，更多的是体现在 A 对 B 分支的依赖关系上。

<details><summary>3) 无依赖关系</summary>

- 假如侦测人机分离功能比较简单，两秒钟就把 `release` 版本开发出来了，那立马就可以把 B 分支合并到正式版本上。
  之后 A 分支采用包含侦测人机分离功能的正式版本，就啥事也没有了，可以接着在 A 分支上开发自动爆炸功能。

-----

</details><!-- 3) 无依赖关系 -->

<details><summary>3) 有依赖关系</summary>

- 假如侦测功能有点复杂，一时半会没法合并到正式版本上，那可以开发到一定程度之后让自动爆炸功能先用着，凑合一下。
  这样子 A 分支就对 B 分支产生了依赖关系。

  通过管理工具把 B 合并到 A 分支，并递增开发版本号，记录依赖关系。

- 如果在 A 分支——也就是自动爆炸功能——开发完之前，B 分支——侦测人机分离功能——就开发完并合并到正式版本中，并且 A 分支引入了合并了 B 分支的正式版本，那么 A 和 B 分支间的依赖关系记录就可以被删除了。

- 如果侦测人机分离功能实在是有点复杂，以至于自动爆炸功能都达到 `beta` 开发阶段，侦测功能依然在 `alpha` 阶段，那么自动爆炸功能所在的 A 分支就受到了依赖关系的限制。

  由于依赖于一个未达到 `beta` 阶段及以上的 B 分支，就算 A 分支已经达到了 `release.9999` 版本，也不可以把 A 分支合并到前瞻版本。
  同样的，如果 B 分支低于 `release` 阶段，那么不论 A 分支是什么阶段，都不可以合并到正式版本中。

  这种依赖限制具有传递性。
  如果 B 分支又依赖 C 分支、C 分支又依赖 D 分支，那么 B、C、D 中只要有一个分支没有达到合并要求，A 分支就不可以合并。

- 不论 B 分支开发情况如何，只要最终 A 分支成功合并到正式版本，自动爆炸功能可以算是开发完了。

</details><!-- 3) 有依赖关系 -->

</details><!-- 2) 多分支 -->

-----

</details><!-- 1) 单个包 -->

<details> <summary>1) 多个包</summary>

- 以仓库中好多个包，比如 `bomb@3.2.4` 和 `detect@5.3.2` ，为基础进行开发。

  开发的第一次提交是将接下来要进行更改的包的版本改为 `-dev.<feature>.alpha.0` ——在此之后，任何一个包在有变更之前都要先改版本号为开发版本。
  这是为了保证管理工具能够清晰地辨别哪些包被修改了，而哪些没有。
  同时管理工具也应该具备寻找并修复那些被修改但忘记改版本号的包的能力。

<details><summary>2) 单分支</summary>

- 开发，仓库里各个包的开发版本不断递增。
  可能递增的速度不一样，这是正常的。

- 当某一个包的正式版更新后，可以用一次提交来引入新版。
  这里和单个包没什么区别。

- 当分支的某些包到达足够合并的开发阶段后，可以对 `next` 或 `master` 分支进行一次 PR 。

  管理工具要找到哪些包可以被合并，而哪些包不能合并。
  根据情景不同，有两种寻找方式：
  1. 一刀切：

     如果一个分支有任何包没达到指定开发阶段，那么这个分支所有包都不能合并；
     否则，所有包都能合并。
  2. 分析依赖关系：

     对于每个包，如果这个包及其依赖链上的包中有任何一个未达到指定开发阶段，那么这个包不能被合并；
  否则，这个包可以合并。

  找到后，再只将那些可合并的包的代码更改合并到 `next` 或 `master` 分支。

  与单个包一样，被合并的包也要递增版本号，根据分支描述生成 changelog 并发布。

- 当 A 分支上的所有包都成功合并到正式版本后，A 分支就可以删掉了，自动爆炸功能就算是完全开发完了。

-----

</details><!-- 2) 单分支 -->

<details><summary>2) 多分支</summary>

- 与单个包时相同，开发时若哪些东西有点难开发，可以作为新功能再新建一个分支来开发。
  比如这里新建 B 分支。

- 若在 A 分支提出 PR 到正式版本或前瞻版本之前，B 分支的所有包就已经合并到正式版本了，那分支间的依赖关系基本可以不用考虑。

- 若 A 分支提 PR 时 B 分支仍有一些包处在开发中，那么管理工具需要在合并分支时记录哪些包被合并了，以此来使用更复杂且准确的方法判断一个包能不能被 PR。
  根据情景不同，有两种方法：
  1. 一刀切：

     看分支依赖链上的分支是否所有包都到达指定阶段：
     若有任意被依赖的分支并不是所有包都到达指定阶段，则本分支所有包都不合并；
     否则，再看分支内有没有未到达指定开发阶段的包：
     若有，则所有包都不合并；
     若无，则所有包都可以合并。
  2. 根据包间的依赖关系进行分析：

     建立每个包的依赖树：
     首先根据 `package.json` 找到这个包在同一分支内所依赖的处于开发状态的包；
     再根据依赖分支链中上一层分支里这个包是否被合并过来断定这个包是否依赖于上一层分支的自己。
     就这么不断往下构建依赖树，直到找不到其他依赖为止就算构建完成。

     若树上有任意版本未达到指定开发阶段，则这个包不能被合并。

- 不论 B 分支或者其他什么分支开发情况如何，只要 A 分支里所有的包都成功合并到正式版本，自动爆炸功能就算开发完了。

</details><!-- 2) 多分支 -->

</details><!-- 1) 多个包 -->
