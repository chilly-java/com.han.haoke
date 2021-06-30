package cn.itcast.haoke.dubbo.server.api;

import cn.itcast.haoke.dubbo.server.pojo.HouseResources;

public interface ApiHouseResourcesService {
    /**
     * 新增房源
     * @param houseResources
     * @return -1:输入的参数不符合要求，0：数据插入数据库失败，1：成功
     */
    int saveHouseResources(HouseResources houseResources);
}
