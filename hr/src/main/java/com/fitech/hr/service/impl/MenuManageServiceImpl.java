package com.fitech.hr.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.fitech.hr.dao.MenuManageDAO;
import com.fitech.hr.model.MenuManage;
import com.fitech.hr.service.MenuManageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MenuManageServiceImpl implements MenuManageService {

    @Autowired
    private MenuManageDAO menuManageDAO;

    @Override
    public JSONObject selectByRecord(MenuManage record, int pageSize, int pageNumber) {
        JSONObject result = new JSONObject();
        result.put("total",this.menuManageDAO.countByRecord(record));
        result.put("rows", this.menuManageDAO.selectByRecord(record, pageSize, pageNumber));
        return result;
    }

    @Override
    public List<MenuManage> selectByTree(String menuId) {
        List<MenuManage> list = new ArrayList<>();
        list.add(this.menuManageDAO.selectByMenuId(menuId));
        return list;
    }

    @Override
    public int insertMenu(MenuManage record) {
        return this.menuManageDAO.insertMenu(record);
    }

    @Override
    public int updateByMenuId(MenuManage record) {
        return this.menuManageDAO.updateByMenuId(record);
    }

    @Override
    public MenuManage selectByMenuId(String menuId) {
        return this.menuManageDAO.selectByMenuId(menuId);
    }

    @Override
    public int deleteByMenuId(String menuId) {
        return this.menuManageDAO.deleteByMenuId(menuId);
    }

    @Override
    public List<MenuManage> selectAllMenu() {
        return this.menuManageDAO.selectAllMenu();
    }

}
