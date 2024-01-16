# 下载图片到 ./img

urls = [
  'https://sns-webpic-qc.xhscdn.com/202401161134/237c5b5f8ec82dc28bae54732fc9a198/spectrum/1040g0k030t3l0hgrka005n4l2ae5kgl93oe00jo!nc_n_webp_mw_1',
  'https://sns-webpic-qc.xhscdn.com/202401161134/3f111f64b3e421c36fc169492f2eb53c/1040g2sg30tm9i7puku6g5p95bl3gi18idt1qmko!nc_n_webp_mw_1',
  'https://sns-webpic-qc.xhscdn.com/202401161134/99065d28a0863e831b15870b2bfe287d/1040g2sg30tlbs2r54k0048blnn2qdor81fe6lh8!nc_n_webp_prv_1',
  'https://sns-webpic-qc.xhscdn.com/202401161134/45e5236200ce36404b080587e8733851/1040g2sg30tk20ss04q6g5o5pjab0945dggg4mt8!nc_n_webp_prv_1',
  'https://sns-webpic-qc.xhscdn.com/202401161134/e5e3b16de634e7257bccd5bfb1257694/1040g2sg30tb3ab5h446g5padnro0lfr75t838do!nc_n_webp_mw_1',
  'https://sns-webpic-qc.xhscdn.com/202401161134/0b073960abb4f9eef3dc42b0de977649/1040g00830st06a1vk2004btb6492lg1500jvpuo!nc_n_webp_mw_1',
  'https://sns-webpic-qc.xhscdn.com/202401161134/5fe001cd81a41e3e6ebb16be318c2289/1040g2sg30tf35p0sk6005oamohr0kkkq2gd4es8!nc_n_webp_mw_1',
  'https://sns-webpic-qc.xhscdn.com/202401161134/ccdce5d7237e105353ebfabeca4c9b28/1040g2sg30t9kpl87jq005p9ktrm110au92vj4rg!nc_n_webp_mw_1',
  'https://sns-webpic-qc.xhscdn.com/202401161148/8fc6d06cffdc4e0ab53131e5ff104649/1040g2sg30tmp80sdko005ovaabtpi7lk4v10m4o!nc_n_webp_mw_1',
  'https://sns-webpic-qc.xhscdn.com/202401161148/4c24382f299eafe7917d8fae7f6a94ef/1040g2sg30sfv6rjhjm005o4ji0v0bk2ua92depo!nc_n_webp_mw_1',
  'https://sns-webpic-qc.xhscdn.com/202401161148/ec4543c8da1fdc18f9a2f2a619b5a569/1040g00830sp2ogj73u00401f1i551giauarv7i8!nc_n_webp_mw_1',
  'https://sns-webpic-qc.xhscdn.com/202401161148/8dfbab769db1aae6f0792ceb88131b23/spectrum/1040g0k030ssua7idka005o38k8r08j5u12tmano!nc_n_webp_prv_1',
  'https://sns-webpic-qc.xhscdn.com/202401161148/0a4469fc141d8337e33de79665b017f8/1040g00830t77tv98466g5p9oo351ghv5v16mig0!nc_n_webp_mw_1',
  'https://sns-webpic-qc.xhscdn.com/202401161148/c2dd42ae91b5323a3658c418576d0d1d/1040g2sg30t5sv87gjs605oiorrgocjvhqhse4pg!nc_n_webp_mw_1',
  'https://sns-webpic-qc.xhscdn.com/202401161148/b9bd86eb569be8b7a1393e951dda2055/spectrum/1040g0k030tmp9co44u005op4b77ovmlgjlde018!nc_n_webp_mw_1',
  'https://sns-webpic-qc.xhscdn.com/202401161148/88f2a9aa9944b9740adfb058aa8c754a/1040g00830tl6kk32km6g5pb8end86kg6qdpl6v0!nc_n_webp_mw_1',
  'https://sns-webpic-qc.xhscdn.com/202401161148/8812a236b8f17441e6937c4a9e60866b/1040g00830t60633ajs005o52g680bgkio2blqgg!nc_n_webp_mw_1',
  'https://sns-webpic-qc.xhscdn.com/202401161148/a79a0d185d607ddd8b4848e149962066/1040g2sg30tp8s39fkk005p7erbq08srfaqmjhgg!nc_n_webp_mw_1',
  'https://sns-webpic-qc.xhscdn.com/202401161148/22b2570867a913a11db8ebaae0d8c709/spectrum/1040g0k030sr8sm4146005pc00p573ccu5vpvj0g!nc_n_webp_mw_1',
  'https://sns-webpic-qc.xhscdn.com/202401161150/6d523c1b1fb2db4890fa71c31c7e75c9/1040g2sg30tpah1sbku005os0vpm7ro4t64nom30!nc_n_webp_mw_1',
  'https://sns-webpic-qc.xhscdn.com/202401161150/234e745319d7fdf0967b533f09341d22/1040g00830t0ugrttk2005ombt3n3hv1idqc5io0!nc_n_webp_mw_1',
  'https://sns-webpic-qc.xhscdn.com/202401161150/2edfad34c1b3ae3c72d65da790080c92/1040g00830tdm1hg6k6005p75i32gack7orqn0e0!nc_n_webp_mw_1'
]

import requests
import os

def getImg(url):
  root = './img/'
  path = root + url.split('/')[-1] + '.webp'
  try:
    if not os.path.exists(root):
      os.mkdir(root)
    if not os.path.exists(path):
      r = requests.get(url)
      with open(path, 'wb') as f:
        f.write(r.content)
        print('图片保存成功')
    else:
      print('图片已存在')
  except:
    print('爬取失败')

for url in urls:
  getImg(url)