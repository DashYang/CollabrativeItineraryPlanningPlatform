package cn.edu.fudan.mybaits;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectKey;

/**
 * @author dash
 * @version 1.0 date 2015-10-30
 * @since JDK1.6
 */
public interface ClientPullMessageLogDao {
	@Insert("insert into client_pull_messagelog (`timestamp`,`date`,`city`,`group`,`user`,`type`,`start`,`end`,`title`,`content`,`lastUpdateId`,`receiveTime`)"
			+ " values (#{timestamp},#{date},#{city},#{group},#{user},#{type},#{start},#{end},#{title},#{content},#{lastUpdateId},#{receiveTime})")
	@SelectKey(before = false, keyProperty = "id",statement = { "SELECT last_insert_id() as id" }, resultType = java.lang.Integer.class)
	public int insert(ClientPullMessageLog messageLog);
	
	@Select("select * from client_pull_messagelog where `date` = #{date} and `city` = #{city} and `group` = #{group} and `id`> #{lastUpdateId} and `user` != #{user}")
	public List<ClientPullMessageLog> getMessageByMapInfo(@Param(value="date") String date ,@Param(value="city") String city , @Param(value="group") String group, @Param(value="lastUpdateId") int lastUpdateId ,
			@Param(value="user") String user);
	
	@Select("select * from client_pull_messagelog where `date` = #{date} and `city` = #{city} and `group` = #{group} and `id`> #{lastUpdateId}")
	public List<ClientPullMessageLog> getMessageByMapInfoExceptUser(@Param(value="date") String date ,@Param(value="city") String city , @Param(value="group") String group, @Param(value="lastUpdateId") int lastUpdateId);
}
