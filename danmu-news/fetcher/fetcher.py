#!/usr/bin/env python3
import itertools
import sys
import json
from multiprocessing.dummy import Pool

import requests
from bs4 import BeautifulSoup


class XinhuaFetcher(object):
    """
    从新华网抓取新闻标题
    """
    def __init__(self, area="jiangsu"):
        super().__init__()
        self.area = area

    def fetch(self):
        url = "http://www.xinhuanet.com/"
        header = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
        }
        data = requests.get(url, headers=header, timeout=10).content
        soup = BeautifulSoup(str(data, 'utf-8'), 'lxml')
        news_titles = soup.select("ul.dataList01 > li > a")
        focus_titles = soup.select(".focusWordBlue a")

        area_data = requests.get("http://www.xinhuanet.com/dzxw2/iframe_{0}.htm".format(self.area), headers=header, timeout=10).content
        area_soup = BeautifulSoup(str(area_data, 'utf-8'), 'lxml')
        area_titles = area_soup.select("ul > li > a")

        result = []
        for n in itertools.chain(news_titles, focus_titles, area_titles):
            title = n.get_text()
            link = n.get("href")
            if '[' in title or "丨" in title or "｜" in title:
                continue
            data = {
                "title": title,
                "link": link
            }
            result.append(data)

        # focus titles
        return result


class XianDaiKuaiBaoFetcher(object):
    def __init__(self):
        super().__init__()

    def fetch(self):
        url = "http://www.xdkb.net/"
        header = {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
        }
        data = requests.get(url, headers=header, timeout=10).content
        soup = BeautifulSoup(str(data, 'utf-8'), 'lxml')
        titles = soup.select(".f-fl > .feeds-item h3 a")
        result = []
        for n in itertools.chain(titles):
            title = n.get_text()
            link = n.get("href")
            data = {
                "title": title,
                "link": link
            }
            result.append(data)

        # focus titles
        return result


def fetch_all_news():
    fetchers = [
        XinhuaFetcher(),
        XianDaiKuaiBaoFetcher()
    ]
    pool = Pool(processes=len(fetchers))
    results = pool.map(lambda x: x.fetch(), fetchers)
    return list(itertools.chain(*results))


if __name__ == "__main__":
    results = fetch_all_news()
    json.dump(results, sys.stdout, ensure_ascii=False, indent=4)
